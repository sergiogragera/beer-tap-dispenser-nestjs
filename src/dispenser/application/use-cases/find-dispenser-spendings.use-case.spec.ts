import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import mock from 'jest-mock-extended/lib/Mock';
import { FindDispenserSpendingsUseCase } from './find-dispenser-spendings.use-case';
import { DispenserUsageRepository } from '../../domain/persistence/dispenser-usage.repository';
import { DispenserUsage } from '../../domain/models/dispenser-usage';
import { DispenserUsageId } from '../../domain/models/value-objects/dispenser-usage-id.value-object';

describe('FindDispenserSpendingsUseCase', () => {
  let useCase: FindDispenserSpendingsUseCase;
  const dispenserRepository = mock<DispenserRepository>();
  const usageRepository = mock<DispenserUsageRepository>();

  beforeEach(() => {
    useCase = new FindDispenserSpendingsUseCase(
      dispenserRepository,
      usageRepository,
    );
  });

  it('should throw DispenserNotFoundException when not found', async () => {
    const id = DispenserId.create();

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(null);

    expect(useCase.execute(id)).rejects.toThrow(DispenserNotFoundException);
  });

  it('should return open dispenser spendings when no usages saved', async () => {
    const id = DispenserId.create();
    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(usageRepository, 'findAll').mockResolvedValue([]);

    const response = await useCase.execute(id);

    expect(dispenserRepository.findById).toHaveBeenCalledWith(id);
    expect(usageRepository.findAll).toHaveBeenCalledWith(id);
    expect(response).toEqual([
      {
        dispenserId: dispenser.id.value,
        flowVolume: '0.0001',
        totalSpent: expect.any(String),
        openedAt: '1/1/2025, 10:59:35 AM',
      },
    ]);
  });

  it('should return open dispenser spendings and usages', async () => {
    const id = DispenserId.create();
    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    const dispenserUsage = DispenserUsage.fromPrimitives({
      id: DispenserUsageId.create().value,
      dispenserId: dispenser.id.value,
      flowVolume: dispenser.flowVolume.value,
      totalSpent: '100',
      openedAt: '2/1/2025, 10:59:35 AM',
      closedAt: '2/1/2025, 11:00:35 AM',
    });

    jest.spyOn(dispenserRepository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(usageRepository, 'findAll').mockResolvedValue([dispenserUsage]);

    const response = await useCase.execute(id);

    expect(dispenserRepository.findById).toHaveBeenCalledWith(id);
    expect(usageRepository.findAll).toHaveBeenCalledWith(id);
    expect(response).toEqual([
      {
        id: dispenserUsage.id.value,
        dispenserId: dispenser.id.value,
        flowVolume: dispenserUsage.flowVolume.value,
        totalSpent: '100',
        openedAt: '2/1/2025, 10:59:35 AM',
        closedAt: '2/1/2025, 11:00:35 AM',
      },
      {
        dispenserId: dispenser.id.value,
        flowVolume: '0.0001',
        totalSpent: expect.any(String),
        openedAt: '1/1/2025, 10:59:35 AM',
      },
    ]);
  });
});
