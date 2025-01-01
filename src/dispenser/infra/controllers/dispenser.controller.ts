import { Controller, Post, Body } from '@nestjs/common';
import { CreateDispenserDto } from '../../domain/dto/create-dispenser.dto';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.service';
import { DispenserPrimitives } from '../../domain/models/dispenser';

@Controller('dispenser')
export class DispenserController {
  constructor(
    private readonly createDispenserUseCase: CreateDispenserUseCase,
  ) {}

  @Post()
  async create(
    @Body() createDispenserDto: CreateDispenserDto,
  ): Promise<DispenserPrimitives> {
    return this.createDispenserUseCase.execute(createDispenserDto);
  }
}
