import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateDispenserDto {
  @ApiProperty({
    type: Number,
    description:
      'Flow volume is the number of liters per second are coming out from the tap',
    example: 0.0653,
  })
  @IsPositive()
  flow_volume!: string;
}
