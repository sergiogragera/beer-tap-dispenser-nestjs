import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import mock from 'jest-mock-extended/lib/Mock';
import { DispenserMikroRepository } from './dispenser-mikro.repository';
import { EntityManager, OptimisticLockError } from '@mikro-orm/postgresql';
import { DispenserMikroEntity } from './dispenser-mikro.entity';
import { DispenserAlreadyOpenedException } from '../../domain/exceptions/dispenser-already-opened.exception';
import { DispenserAlreadyClosedException } from '../../domain/exceptions/dispenser-already-closed.exception';

describe('DispenserMikroRepository', () => {
  let repository: DispenserMikroRepository;
  const entityManager = mock<EntityManager>();

  beforeEach(() => {
    repository = new DispenserMikroRepository(entityManager);
    jest.resetAllMocks();
  });

  it('should return null when dispenser not found', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

    const response = await repository.findById(dispenser.id);

    expect(entityManager.findOne).toHaveBeenCalledWith(
      DispenserMikroEntity,
      dispenser.id.value,
    );
    expect(response).toBeNull();
  });

  it('should return dispenser when dispenser found', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest
      .spyOn(entityManager, 'findOne')
      .mockResolvedValue(dispenser.toPrimitives());

    const response = await repository.findById(dispenser.id);

    expect(entityManager.findOne).toHaveBeenCalledWith(
      DispenserMikroEntity,
      dispenser.id.value,
    );
    expect(response).toEqual(dispenser);
  });

  it('should save dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest
      .spyOn(entityManager, 'create')
      .mockReturnValue(dispenser.toPrimitives());

    const response = await repository.save(dispenser);

    expect(entityManager.persistAndFlush).toHaveBeenCalledWith(
      dispenser.toPrimitives(),
    );
    expect(response).toEqual(dispenser);
  });

  it('should update dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest
      .spyOn(entityManager, 'getReference')
      .mockReturnValue(dispenser.toPrimitives());
    jest
      .spyOn(entityManager, 'assign')
      .mockReturnValue(dispenser.toPrimitives());

    const response = await repository.update(dispenser);

    expect(entityManager.persist).toHaveBeenCalledWith(
      dispenser.toPrimitives(),
    );
    expect(response).toEqual(dispenser);
  });

  it('should throw Error when dispenser flush exception', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    jest
      .spyOn(entityManager, 'flush')
      .mockRejectedValue(new Error('other error'));

    expect(repository.update(dispenser)).rejects.toThrow('other error');
  });

  it('should throw DispenserAlreadyOpenedException when dispenser open lock exception', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();

    jest
      .spyOn(entityManager, 'flush')
      .mockRejectedValue(new OptimisticLockError('lock'));

    expect(repository.update(dispenser)).rejects.toThrow(
      DispenserAlreadyOpenedException,
    );
  });

  it('should throw DispenserAlreadyClosedException when dispenser close lock exception', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    jest
      .spyOn(entityManager, 'flush')
      .mockRejectedValue(new OptimisticLockError('lock'));

    expect(repository.update(dispenser)).rejects.toThrow(
      DispenserAlreadyClosedException,
    );
  });

  it('should update dispenser and add usages', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();
    dispenser.close();

    jest
      .spyOn(entityManager, 'getReference')
      .mockReturnValue(dispenser.toPrimitives());
    jest
      .spyOn(entityManager, 'assign')
      .mockReturnValue(dispenser.toPrimitives());
    jest
      .spyOn(entityManager, 'create')
      .mockReturnValue(dispenser.lastUsages[0].toPrimitives());
    jest
      .spyOn(entityManager, 'flush')
      .mockImplementation(() => Promise.resolve());

    const response = await repository.update(dispenser);

    expect(entityManager.persist).toHaveBeenCalledTimes(2);
    expect(entityManager.persist).toHaveBeenNthCalledWith(
      1,
      dispenser.toPrimitives(),
    );
    expect(entityManager.persist).toHaveBeenNthCalledWith(
      2,
      dispenser.lastUsages[0].toPrimitives(),
    );
    expect(response).toEqual(
      expect.objectContaining({
        id: dispenser.id,
        flowVolume: dispenser.flowVolume,
        status: dispenser.status,
        version: 1,
      }),
    );
  });
});
