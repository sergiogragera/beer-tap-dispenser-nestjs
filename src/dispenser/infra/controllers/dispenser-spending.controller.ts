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
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { SpendingResponseDto } from './dto/response/spending-response.dto';
import { HistoricalUsageDto } from '../../domain/dto/historical-usage.dto';

@Controller('dispenser/:id/spending')
export class DispenserSpendingController {
  constructor(
    private readonly findDispenserSpendingsUseCase: FindDispenserSpendingsUseCase,
  ) {}

  @Get()
  async findAll(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SpendingResponseDto> {
    try {
      const usages = await this.findDispenserSpendingsUseCase.execute(
        DispenserId.fromString(id),
      );
      return this.getSpendingResponseFromHistoricalUsages(usages);
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

  private getSpendingResponseFromHistoricalUsages(
    usages: HistoricalUsageDto[],
  ): SpendingResponseDto {
    return {
      amount: usages.reduce(
        (total, usage) => total + parseFloat(usage.totalSpent),
        0,
      ),
      usages: usages.map((usage) => {
        return {
          opened_at: usage.openedAt,
          closed_at: usage.closedAt || null,
          flow_volume: +usage.flowVolume,
          totl_spent: +usage.totalSpent,
        };
      }),
    };
  }
}
