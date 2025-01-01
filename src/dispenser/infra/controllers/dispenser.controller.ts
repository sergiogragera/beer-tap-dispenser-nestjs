import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CreateDispenserDto } from '../../domain/dto/create-dispenser.dto';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { OpenDispenserUseCase } from '../../application/use-cases/open-dispenser.use-case';
import {
  DispenserStatus,
  UpdateDispenserDto,
} from '../../domain/dto/update-dispenser.dto';
import { CloseDispenserUseCase } from '../../application/use-cases/close-dispenser.use-case';

@Controller('dispenser')
export class DispenserController {
  constructor(
    private readonly findDispenserUserCase: FindDispenserUseCase,
    private readonly createDispenserUseCase: CreateDispenserUseCase,
    private readonly openDispenserUseCase: OpenDispenserUseCase,
    private readonly closeDispenserUseCase: CloseDispenserUseCase,
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

  @Put(':id')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDispenserDto: UpdateDispenserDto,
  ): Promise<DispenserPrimitives> {
    if (updateDispenserDto.status === DispenserStatus.OPEN) {
      return this.openDispenserUseCase.execute(
        DispenserId.fromString(id),
        new Date(updateDispenserDto.updated_at),
      );
    }
    return this.closeDispenserUseCase.execute(
      DispenserId.fromString(id),
      new Date(updateDispenserDto.updated_at),
    );
  }
}
