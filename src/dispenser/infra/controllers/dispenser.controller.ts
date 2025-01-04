import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateDispenserDto } from './dto/request/create-dispenser.dto';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { DispenserResponseDto } from './dto/response/dispenser-response.dto';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { DispenserResponseAdapter } from './adapters/dispenser-response.adapter';

@Controller('dispenser')
export class DispenserController {
  constructor(
    private readonly findDispenserUserCase: FindDispenserUseCase,
    private readonly createDispenserUseCase: CreateDispenserUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Returns a dispenser',
    description: 'This endpoint find a dispenserby id',
  })
  @ApiOkResponse({
    type: DispenserResponseDto,
    description: 'Dispenser found correctly',
  })
  @ApiNotFoundResponse({
    description: 'Dispenser not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Dispenser Id',
  })
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DispenserResponseDto> {
    try {
      const dispenser = await this.findDispenserUserCase.execute(
        DispenserId.fromString(id),
      );
      return DispenserResponseAdapter.adapt(dispenser);
    } catch (error) {
      if (error instanceof DispenserNotFoundException) {
        throw new HttpException('Dispenser not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new dispenser',
    description:
      ' This endpoint will create a new dispenser with a configuration about how much volume comes out (litres per second)',
  })
  @ApiOkResponse({
    type: DispenserResponseDto,
    description: 'Dispenser created correctly',
  })
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<DispenserResponseDto> {
    const flowVolume = DispenserFlowVolume.fromString(
      createDispenserDto.flow_volume,
    );
    const dispenser = await this.createDispenserUseCase.execute(flowVolume);
    return DispenserResponseAdapter.adapt(dispenser);
  }
}
