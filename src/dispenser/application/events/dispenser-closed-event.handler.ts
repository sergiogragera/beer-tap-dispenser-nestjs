import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DispenserClosedEvent } from '../../../dispenser/domain/events/dispenser-closed.event';
import { DispenserUsage } from '../../../dispenser/domain/models/dispenser-usage';
import { DispenserUsageRepository } from '../../../dispenser/domain/persistence/dispenser-usage.repository';
import { DispenserRepository } from '../../../dispenser/domain/persistence/dispenser.repository';
import { DispenserNotFoundException } from '../../../dispenser/domain/exceptions/dispenser-not-found.exception';

@EventsHandler(DispenserClosedEvent)
export class DispenserClosedHandler
  implements IEventHandler<DispenserClosedEvent>
{
  private readonly logger = new Logger(DispenserClosedEvent.name);

  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    @Inject('DispenserUsageRepository')
    private readonly dispenserUsageRepository: DispenserUsageRepository,
  ) {}

  async handle(dispenserClosedEvent: DispenserClosedEvent) {
    const { dispenserId } = dispenserClosedEvent;
    this.logger.log(
      `dispenser with id ${dispenserId.value} closed successfully`,
    );
    const dispenser = await this.dispenserRepository.findById(dispenserId);
    if (!dispenser) {
      throw new DispenserNotFoundException(dispenserId);
    }
    const usage = DispenserUsage.create(dispenser);
    await this.dispenserUsageRepository.save(usage);
    this.logger.log(
      `dispenser usage with spent ${usage.totalSpent.value} saved successfully`,
    );
  }
}
