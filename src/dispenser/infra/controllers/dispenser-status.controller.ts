import {
  Controller,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { UpdateStatusDispenserUseCase } from '../../application/use-cases/update-status-dispenser.use-case';
import { UpdateStatusDispenserDto } from './dto/request/update-status-dispenser.dto';
import { DispenserAlreadyOpenedException } from '../../domain/exceptions/dispenser-already-opened.exception';
import { DispenserAlreadyClosedException } from '../../domain/exceptions/dispenser-already-closed.exception';
import { DispenserClosedAfterOpenException } from '../../domain/exceptions/dispenser-closed-after-open.exception';
import { DispenserNotOpenedException } from '../../domain/exceptions/dispenser-not-opened.exception';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import {
  ApiAcceptedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@Controller('dispenser/:id/status')
export class DispenserStatusController {
  constructor(
    private readonly updateStatusDispenserUseCase: UpdateStatusDispenserUseCase,
  ) {}

  @Put()
  @HttpCode(202)
  @ApiOperation({
    summary: 'Change the dispenser status for a given dispenser Id',
    description: `This endpoint will change the status for a given dispenser. 

The status could be:
> open: The dispenser will start counting how much time (and beer) is spent on this usage

> close: The dispenser closes immediately the beer flow and stops counting`,
  })
  @ApiParam({
    name: 'id',
    description: 'Dispenser Id',
  })
  @ApiAcceptedResponse({
    description: 'Status of the tap changed correctly',
  })
  @ApiConflictResponse({
    description: 'Dispenser is already opened/closed',
  })
  @ApiNotFoundResponse({
    description: 'Dispenser not found',
  })
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDispenserDto: UpdateStatusDispenserDto,
  ): Promise<void> {
    try {
      const updatedAt = new Date(updateDispenserDto.updated_at ?? Date.now());
      await this.updateStatusDispenserUseCase.execute(
        DispenserId.fromString(id),
        updateDispenserDto.status,
        updatedAt,
      );
    } catch (error) {
      if (
        error instanceof DispenserAlreadyOpenedException ||
        error instanceof DispenserAlreadyClosedException ||
        error instanceof DispenserClosedAfterOpenException ||
        error instanceof DispenserNotOpenedException
      ) {
        throw new HttpException(
          'Dispenser is already opened/closed',
          HttpStatus.CONFLICT,
        );
      }

      if (error instanceof DispenserNotFoundException) {
        throw new HttpException('Dispenser not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
