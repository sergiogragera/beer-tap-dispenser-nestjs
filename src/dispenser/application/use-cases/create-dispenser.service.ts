import { Inject, Injectable } from '@nestjs/common';
import { CreateDispenserDto } from '../../domain/dto/create-dispenser.dto';
import { DispenserFlowVolume } from 'src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import {
  Dispenser,
  DispenserPrimitives,
} from 'src/dispenser/domain/models/dispenser';

@Injectable()
export class CreateDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(
    createDispenserDto: CreateDispenserDto,
  ): Promise<DispenserPrimitives> {
    const flowVolume = DispenserFlowVolume.fromString(
      createDispenserDto.flow_volume,
    );

    const dispenser = await this.dispenserRepository.save(
      Dispenser.create(flowVolume),
    );

    return dispenser.toPrimitives();
  }
}
