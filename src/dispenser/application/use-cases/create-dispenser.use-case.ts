import { Inject, Injectable, Logger } from '@nestjs/common';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';

@Injectable()
export class CreateDispenserUseCase {
  private readonly logger = new Logger(CreateDispenserUseCase.name);

  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
  ) {}

  async execute(flowVolume: DispenserFlowVolume): Promise<Dispenser> {
    this.logger.log(
      `create dispenser with flow volume ${flowVolume.value} request received`,
    );
    const dispenser = await this.dispenserRepository.save(
      Dispenser.create(flowVolume),
    );
    this.logger.log(
      `created dispenser with id ${dispenser.id.value} successfully`,
    );

    return dispenser;
  }
}
