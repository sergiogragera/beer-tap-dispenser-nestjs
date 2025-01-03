export interface HistoricalUsageDto {
  dispenserId: string;
  flowVolume: string;
  totalSpent: string;
  openedAt: string;
  closedAt?: string;
}
