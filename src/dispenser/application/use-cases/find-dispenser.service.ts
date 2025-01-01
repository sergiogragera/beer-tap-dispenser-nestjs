import { Inject, Injectable } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserPrimitives } from 'src/dispenser/domain/models/dispenser';
import { DispenserId } from 'src/dispenser/domain/models/value-objects/dispenser-id.value-object';

@Injectable()
export class FindDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(id: DispenserId): Promise<DispenserPrimitives> {
    const dispenser = await this.dispenserRepository.findById(id);

    return dispenser.toPrimitives();
  }
}
