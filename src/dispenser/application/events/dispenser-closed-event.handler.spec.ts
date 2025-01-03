import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserUsageRepository } from '../../../dispenser/domain/persistence/dispenser-usage.repository';
import { DispenserClosedHandler } from './dispenser-closed-event.handler';
import { DispenserClosedEvent } from '../../../dispenser/domain/events/dispenser-closed.event';
import { DispenserUsage } from '../../../dispenser/domain/models/dispenser-usage';
import { mock } from 'jest-mock-extended';
import { DispenserNotFoundException } from '../../../dispenser/domain/exceptions/dispenser-not-found.exception';

describe('DispenserClosedHandler', () => {
  let handler: DispenserClosedHandler;
  const dispenserRepository = mock<DispenserRepository>();
  const dispenserUsageRepository = mock<DispenserUsageRepository>();

  beforeEach(() => {
    handler = new DispenserClosedHandler(
      dispenserRepository,
      dispenserUsageRepository,
    );
  });

  it('should throw DispenserNotFoundException when dispenser not exists', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    const dispenserUsage = DispenserUsage.create(dispenser);

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(null);
    jest
      .spyOn(dispenserUsageRepository, 'save')
      .mockResolvedValue(dispenserUsage);

    expect(
      handler.handle(new DispenserClosedEvent(dispenser.id)),
    ).rejects.toThrow(DispenserNotFoundException);

    expect(dispenserRepository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(dispenserUsageRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should save dispenser usage', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    const dispenserUsage = DispenserUsage.create(dispenser);

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(dispenser);
    jest
      .spyOn(dispenserUsageRepository, 'save')
      .mockResolvedValue(dispenserUsage);

    await handler.handle(new DispenserClosedEvent(dispenser.id));

    expect(dispenserRepository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(dispenserUsageRepository.save).toHaveBeenCalledWith(
      expect.any(DispenserUsage),
    );
  });
});
