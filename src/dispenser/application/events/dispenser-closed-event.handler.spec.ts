import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserMikroRepository } from '../../infra/persistence/dispenser-mikro.repository';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserUsageMikroRepository } from '../../../dispenser/infra/persistence/dispenser-usage-mikro.repository';
import { DispenserUsageRepository } from '../../../dispenser/domain/persistence/dispenser-usage.repository';
import { DispenserClosedHandler } from './dispenser-closed-event.handler';
import { DispenserClosedEvent } from '../../../dispenser/domain/events/dispenser-closed.event';
import { DispenserUsage } from '../../../dispenser/domain/models/dispenser-usage';

describe('DispenserClosedHandler', () => {
  let handler: DispenserClosedHandler;
  let dispenserRepository: DispenserRepository;
  let dispenserUsageRepository: DispenserUsageRepository;

  beforeEach(() => {
    dispenserRepository = new DispenserMikroRepository(null);
    dispenserUsageRepository = new DispenserUsageMikroRepository(null);
    handler = new DispenserClosedHandler(
      dispenserRepository,
      dispenserUsageRepository,
    );
  });

  it('should ', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(dispenserUsageRepository, 'save').mockResolvedValue(null);

    await handler.execute(new DispenserClosedEvent(dispenser.id));

    expect(dispenserRepository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(dispenserUsageRepository.save).toHaveBeenCalledWith(
      expect.any(DispenserUsage),
    );
  });
});
