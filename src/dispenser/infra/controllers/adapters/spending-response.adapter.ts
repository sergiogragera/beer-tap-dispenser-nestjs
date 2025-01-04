import { HistoricalUsageDto } from 'src/dispenser/domain/dto/historical-usage.dto';
import { SpendingResponseDto } from '../dto/response/spending-response.dto';

export class SpendingResponseAdapter {
  static adapt(usages: HistoricalUsageDto[]): SpendingResponseDto {
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
          total_spent: +usage.totalSpent,
        };
      }),
    };
  }
}
