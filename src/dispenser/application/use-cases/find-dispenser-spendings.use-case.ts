import { Inject, Injectable } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { DispenserUsageRepository } from '../../domain/persistence/dispenser-usage.repository';
import { DispenserUsagePrimitives } from '../../domain/models/dispenser-usage';
import { DispenserSpent } from 'src/dispenser/domain/models/value-objects/dispenser-spent.value-object';
import { Dispenser } from 'src/dispenser/domain/models/dispenser';

@Injectable()
export class FindDispenserSpendingsUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    @Inject('DispenserUsageRepository')
    private readonly dispenserUsageRepository: DispenserUsageRepository,
  ) {}

  async execute(id: DispenserId): Promise<DispenserUsagePrimitives[]> {
    const dispenser = await this.dispenserRepository.findById(id);

    if (!dispenser) {
      throw new DispenserNotFoundException(id);
    }

    const usages = await this.dispenserUsageRepository.findAll(dispenser.id);
    const response = usages.map((usage) => usage.toPrimitives());
    if (dispenser.status.isOpened()) {
      response.push(this.getOpenedUsageFromDispenser(dispenser));
    }

    return response;
  }

  private getOpenedUsageFromDispenser(
    dispenser: Dispenser,
  ): DispenserUsagePrimitives {
    const totalSpent = DispenserSpent.create(
      dispenser.flowVolume,
      dispenser.status.secondsOpened,
    );

    return {
      id: undefined,
      dispenserId: dispenser.id.value,
      flowVolume: dispenser.flowVolume.value,
      openedAt: dispenser.status.openedAt,
      closedAt: null,
      totalSpent: totalSpent.value,
    };
  }
}
