import {
  Controller,
  Param,
  ParseUUIDPipe,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FindDispenserSpendingsUseCase } from '../../application/use-cases/find-dispenser-spendings.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { HistoricalUsageDto } from '../../domain/dto/historical-usage.dto';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';

@Controller('dispenser/:id/spending')
export class DispenserSpendingController {
  constructor(
    private readonly findDispenserSpendingsUseCase: FindDispenserSpendingsUseCase,
  ) {}

  @Get()
  async findAll(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<HistoricalUsageDto[]> {
    try {
      return await this.findDispenserSpendingsUseCase.execute(
        DispenserId.fromString(id),
      );
    } catch (error) {
      if (error instanceof DispenserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
