import { ApiProperty } from '@nestjs/swagger';
import { UsageLineResponseDto } from './usage-line-response.dto';

export class SpendingResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Total amount',
    example: 10.232,
  })
  amount!: number;

  @ApiProperty({
    type: UsageLineResponseDto,
    isArray: true,
    description: 'Usage lines',
  })
  usages!: UsageLineResponseDto[];
}
