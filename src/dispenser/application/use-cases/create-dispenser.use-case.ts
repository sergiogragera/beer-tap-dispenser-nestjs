import { Inject, Injectable } from '@nestjs/common';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser, DispenserPrimitives } from '../../domain/models/dispenser';

@Injectable()
export class CreateDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(flowVolume: DispenserFlowVolume): Promise<DispenserPrimitives> {
    const dispenser = await this.dispenserRepository.save(
      Dispenser.create(flowVolume),
    );

    return dispenser.toPrimitives();
  }
}
