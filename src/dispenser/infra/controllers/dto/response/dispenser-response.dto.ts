import { ApiProperty } from '@nestjs/swagger';

export class DispenserResponseDto {
  @ApiProperty({
    type: String,
    example: 'e678cd48-76cc-474c-b611-94dd2df533cb',
  })
  id!: string;

  @ApiProperty({
    type: Number,
    example: 0.0653,
  })
  flow_volume!: number;
}
