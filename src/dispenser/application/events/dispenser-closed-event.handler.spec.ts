import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserUsageRepository } from '../../../dispenser/domain/persistence/dispenser-usage.repository';
import { DispenserClosedHandler } from './dispenser-closed-event.handler';
import { DispenserClosedEvent } from '../../../dispenser/domain/events/dispenser-closed.event';
import { DispenserUsage } from '../../../dispenser/domain/models/dispenser-usage';
import { mock } from 'jest-mock-extended';
import { LoggerService } from '@nestjs/common';

describe('DispenserClosedHandler', () => {
  let handler: DispenserClosedHandler;
  const dispenserRepository = mock<DispenserRepository>();
  const dispenserUsageRepository = mock<DispenserUsageRepository>();
  const logger = mock<LoggerService>();

  beforeEach(() => {
    handler = new DispenserClosedHandler(
      dispenserRepository,
      dispenserUsageRepository,
      logger,
    );
  });

  it('should ', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(dispenserUsageRepository, 'save').mockResolvedValue(null);

    await handler.handle(new DispenserClosedEvent(dispenser.id));

    expect(dispenserRepository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(dispenserUsageRepository.save).toHaveBeenCalledWith(
      expect.any(DispenserUsage),
    );
  });
});
