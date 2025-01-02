import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';

@Controller('dispenser')
export class DispenserController {
  constructor(
    private readonly findDispenserUserCase: FindDispenserUseCase,
    private readonly createDispenserUseCase: CreateDispenserUseCase,
  ) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DispenserPrimitives> {
    return this.findDispenserUserCase.execute(DispenserId.fromString(id));
  }

  @Post()
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<DispenserPrimitives> {
    const flowVolume = DispenserFlowVolume.fromString(
      createDispenserDto.flow_volume,
    );
    return this.createDispenserUseCase.execute(flowVolume);
  }
}
