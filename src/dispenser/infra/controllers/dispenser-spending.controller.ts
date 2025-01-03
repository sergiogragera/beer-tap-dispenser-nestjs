import { Controller, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { FindDispenserSpendingsUseCase } from '../../application/use-cases/find-dispenser-spendings.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { HistoricalUsageDto } from '../../domain/dto/historical-usage.dto';

@Controller('dispenser/:id/spending')
export class DispenserSpendingController {
  constructor(
    private readonly findDispenserSpendingsUseCase: FindDispenserSpendingsUseCase,
  ) {}

  @Get()
  async findAll(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<HistoricalUsageDto[]> {
    return this.findDispenserSpendingsUseCase.execute(
      DispenserId.fromString(id),
    );
  }
}
