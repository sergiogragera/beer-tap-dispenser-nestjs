import { Controller, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { FindDispenserSpendingsUseCase } from '../../application/use-cases/find-dispenser-spendings.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserUsagePrimitives } from '../../domain/models/dispenser-usage';

@Controller('dispenser/:id/spending')
export class DispenserSpendingController {
  constructor(
    private readonly findDispenserSpendingsUseCase: FindDispenserSpendingsUseCase,
  ) {}

  @Get()
  async findAll(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DispenserUsagePrimitives[]> {
    return this.findDispenserSpendingsUseCase.execute(
      DispenserId.fromString(id),
    );
  }
}
