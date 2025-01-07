import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { CreateDispenserUseCase } from './create-dispenser.use-case';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserStatus } from '../../domain/models/value-objects/dispenser-status.value-object';
import { Uuid } from '../../../shared/value-objects/uuid.value-object';
import mock from 'jest-mock-extended/lib/Mock';

describe('CreateDispenserUseCase', () => {
  let useCase: CreateDispenserUseCase;
  const repository = mock<DispenserRepository>();

  beforeEach(() => {
    useCase = new CreateDispenserUseCase(repository);
    jest.resetAllMocks();
  });

  it('should return a valid dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(repository, 'save').mockResolvedValue(dispenser);

    const response = await useCase.execute(flowVolume);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Uuid),
        flowVolume,
        status: expect.any(DispenserStatus),
      }),
    );
    expect(response).toEqual(dispenser.toPrimitives());
  });
});
