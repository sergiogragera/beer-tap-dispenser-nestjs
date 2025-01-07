import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { UpdateStatusDispenserUseCase } from './update-status-dispenser.use-case';
import { DispenserStatus } from '../../domain/enums/dispenser-status.enum';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { mock } from 'jest-mock-extended';

describe('UpdateStatusDispenserUseCase', () => {
  let useCase: UpdateStatusDispenserUseCase;
  const repository = mock<DispenserRepository>();

  beforeEach(() => {
    useCase = new UpdateStatusDispenserUseCase(repository);
    jest.resetAllMocks();
  });

  it('should throw DispenserNotFoundException when dispenser not found', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    jest.spyOn(repository, 'update');

    expect(
      useCase.execute(dispenser.id, DispenserStatus.OPEN, new Date()),
    ).rejects.toThrow(DispenserNotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(repository.update).toHaveBeenCalledTimes(0);
  });

  it('should open dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(repository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(repository, 'update').mockResolvedValue(dispenser);

    const response = await useCase.execute(
      dispenser.id,
      DispenserStatus.OPEN,
      new Date(),
    );

    expect(repository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: dispenser.id,
        flowVolume,
        status: expect.objectContaining({
          openedAtDate: expect.any(Date),
          closedAtDate: undefined,
        }),
      }),
    );
    expect(response).toEqual(dispenser);
  });

  it('should close dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);
    dispenser.open();

    jest.spyOn(repository, 'findById').mockResolvedValue(dispenser);
    jest.spyOn(repository, 'update').mockResolvedValue(dispenser);

    const response = await useCase.execute(
      dispenser.id,
      DispenserStatus.CLOSE,
      new Date(),
    );

    expect(repository.findById).toHaveBeenCalledWith(dispenser.id);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: dispenser.id,
        flowVolume,
        status: expect.objectContaining({
          openedAtDate: expect.any(Date),
          closedAtDate: expect.any(Date),
        }),
      }),
    );
    expect(response).toEqual(dispenser);
  });
});
