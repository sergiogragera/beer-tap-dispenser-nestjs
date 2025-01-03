import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser, DispenserPrimitives } from '../../domain/models/dispenser';

@Injectable()
export class CreateDispenserUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(flowVolume: DispenserFlowVolume): Promise<DispenserPrimitives> {
    this.logger.log(
      `create dispenser with flow volume ${flowVolume.value} request received`,
    );
    const dispenser = await this.dispenserRepository.save(
      Dispenser.create(flowVolume),
    );

    return dispenser.toPrimitives();
  }
}
