import { Controller, Body, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { UpdateStatusDispenserUseCase } from '../../application/use-cases/update-status-dispenser.use-case';
import { UpdateStatusDispenserDto } from './dto/update-status-dispenser.dto';

@Controller('dispenser/:id/status')
export class DispenserStatusController {
  constructor(
    private readonly updateStatusDispenserUseCase: UpdateStatusDispenserUseCase,
  ) {}

  @Put(':id')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDispenserDto: UpdateStatusDispenserDto,
  ): Promise<DispenserPrimitives> {
    return this.updateStatusDispenserUseCase.execute(
      DispenserId.fromString(id),
      updateDispenserDto.status,
      new Date(updateDispenserDto.updated_at),
    );
  }
}