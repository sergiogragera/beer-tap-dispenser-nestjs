import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DispenserClosedEvent } from '../../../dispenser/domain/events/dispenser-closed.event';
import { DispenserUsage } from '../../../dispenser/domain/models/dispenser-usage';
import { DispenserUsageRepository } from '../../../dispenser/domain/persistence/dispenser-usage.repository';
import { DispenserRepository } from '../../../dispenser/domain/persistence/dispenser.repository';

@EventsHandler(DispenserClosedEvent)
export class DispenserClosedHandler
  implements IEventHandler<DispenserClosedEvent>
{
  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    @Inject('DispenserUsageRepository')
    private readonly dispenserUsageRepository: DispenserUsageRepository,
  ) {}

  async handle(dispenserClosedEvent: DispenserClosedEvent) {
    const { dispenserId } = dispenserClosedEvent;
    const dispenser = await this.dispenserRepository.findById(dispenserId);
    const usage = DispenserUsage.create(dispenser);
    await this.dispenserUsageRepository.save(usage);
  }
}
