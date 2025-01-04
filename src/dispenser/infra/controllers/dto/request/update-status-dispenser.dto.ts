import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { DispenserStatus } from '../../../../domain/enums/dispenser-status.enum';

export class UpdateStatusDispenserDto {
  @ApiProperty({
    description: 'Status of the flow dispenser',
    enum: DispenserStatus,
    example: 'open',
  })
  @IsEnum(DispenserStatus)
  status!: DispenserStatus;

  @ApiProperty({
    type: Date,
    description: 'Timestamp for the update',
    example: '2022-01-01T02:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updated_at?: string;
}
