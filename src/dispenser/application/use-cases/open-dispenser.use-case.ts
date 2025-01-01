import { Inject, Injectable } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';

@Injectable()
export class OpenDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(
    id: DispenserId,
    updatedAt?: Date,
  ): Promise<DispenserPrimitives> {
    const dispenser = await this.dispenserRepository.findById(id);

    if (!dispenser) {
      throw new DispenserNotFoundException(id);
    }

    dispenser.open(updatedAt);
    const updatedDispenser = await this.dispenserRepository.update(dispenser);

    return updatedDispenser.toPrimitives();
  }
}
