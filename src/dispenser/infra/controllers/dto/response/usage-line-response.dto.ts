import { ApiProperty } from '@nestjs/swagger';

export class UsageLineResponseDto {
  @ApiProperty({
    type: String,
    example: '2022-01-01T02:00:00Z',
  })
  opened_at!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '2022-01-01T02:00:00Z',
  })
  closed_at!: string | null;

  @ApiProperty({
    type: Number,
    example: 0.0653,
  })
  flow_volume!: number;

  @ApiProperty({
    type: Number,
    example: 2.0653,
  })
  total_spent!: number;
}
