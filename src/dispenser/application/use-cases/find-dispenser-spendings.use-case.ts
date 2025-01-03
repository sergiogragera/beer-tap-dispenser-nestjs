import { Inject, Injectable } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { DispenserUsageRepository } from '../../domain/persistence/dispenser-usage.repository';
import { DispenserSpent } from '../../domain/models/value-objects/dispenser-spent.value-object';
import { Dispenser } from '../../domain/models/dispenser';
import { HistoricalUsageDto } from 'src/dispenser/domain/dto/historical-usage.dto';

@Injectable()
export class FindDispenserSpendingsUseCase {
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    @Inject('DispenserUsageRepository')
    private readonly dispenserUsageRepository: DispenserUsageRepository,
  ) {}

  async execute(id: DispenserId): Promise<HistoricalUsageDto[]> {
    const dispenser = await this.dispenserRepository.findById(id);

    if (!dispenser) {
      throw new DispenserNotFoundException(id);
    }

    const usages = await this.dispenserUsageRepository.findAll(dispenser.id);
    const response: HistoricalUsageDto[] = usages.map((usage) =>
      usage.toPrimitives(),
    );
    if (dispenser.status.isOpened()) {
      response.push(this.getOpenedUsageFromDispenser(dispenser));
    }

    return response;
  }

  private getOpenedUsageFromDispenser(
    dispenser: Dispenser,
  ): HistoricalUsageDto {
    const totalSpent = DispenserSpent.create(
      dispenser.flowVolume,
      dispenser.status.secondsOpened,
    );

    return {
      dispenserId: dispenser.id.value,
      flowVolume: dispenser.flowVolume.value,
      openedAt: dispenser.status.openedAt ?? new Date().toISOString(),
      totalSpent: totalSpent.value,
    };
  }
}
