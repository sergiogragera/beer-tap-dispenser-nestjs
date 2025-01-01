import { Inject, Injectable } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserPrimitives } from '../../domain//models/dispenser';
import { DispenserId } from '../../domain//models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain//exceptions/dispenser-not-found.exception';

@Injectable()
export class FindDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(id: DispenserId): Promise<DispenserPrimitives> {
    const dispenser = await this.dispenserRepository.findById(id);

    if (!dispenser) {
      throw new DispenserNotFoundException(id);
    }

    return dispenser.toPrimitives();
  }
}
