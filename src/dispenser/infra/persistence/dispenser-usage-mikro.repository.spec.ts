import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import mock from 'jest-mock-extended/lib/Mock';
import { EntityManager } from '@mikro-orm/postgresql';
import { DispenserUsageMikroRepository } from './dispenser-usage-mikro.repository';
import { DispenserUsageMikroEntity } from './dispenser-usage-mikro.entity';
import { DispenserUsage } from '../../domain/models/dispenser-usage';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserUsageId } from '../../domain/models/value-objects/dispenser-usage-id.value-object';

describe('DispenserUsageMikroRepository', () => {
  let repository: DispenserUsageMikroRepository;
  const entityManager = mock<EntityManager>();

  beforeEach(() => {
    repository = new DispenserUsageMikroRepository(entityManager);
    jest.resetAllMocks();
  });

  it('should return empty array when usages not found', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(entityManager, 'find').mockResolvedValue([]);

    const response = await repository.findAll(dispenser.id);

    expect(entityManager.find).toHaveBeenCalledWith(DispenserUsageMikroEntity, {
      dispenserId: dispenser.id.value,
    });
    expect(response).toHaveLength(0);
  });

  it('should return usages when usage found', async () => {
    const id = DispenserUsageId.create();
    const dispenserId = DispenserId.create();
    const usage = DispenserUsage.fromPrimitives({
      id: id.value,
      dispenserId: dispenserId.value,
      flowVolume: '0.0001',
      totalSpent: '23.02',
      openedAt: '2025-02-01T10:59:35.000Z',
      closedAt: '2025-02-01T11:00:35.000Z',
    });

    jest.spyOn(entityManager, 'find').mockResolvedValue([usage.toPrimitives()]);

    const response = await repository.findAll(dispenserId);

    expect(entityManager.find).toHaveBeenCalledWith(DispenserUsageMikroEntity, {
      dispenserId: dispenserId.value,
    });
    expect(response).toEqual([usage]);
  });
});
