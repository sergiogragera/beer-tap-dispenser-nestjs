import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { CreateDispenserUseCase } from './create-dispenser.use-case';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserMikroRepository } from '../../infra/persistence/dispenser-mikro.repository';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserStatus } from '../../domain/models/value-objects/dispenser-status.value-object';

describe('CreateDispenserUseCase', () => {
  let useCase: CreateDispenserUseCase;
  let repository: DispenserRepository;

  beforeEach(() => {
    repository = new DispenserMikroRepository(null);
    useCase = new CreateDispenserUseCase(repository);
  });

  it('should return a valid dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    const dispenser = Dispenser.create(flowVolume);

    jest.spyOn(repository, 'save').mockResolvedValue(dispenser);

    const response = await useCase.execute(flowVolume);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(DispenserId),
        flowVolume,
        status: expect.any(DispenserStatus),
      }),
    );
    expect(response).toEqual(dispenser.toPrimitives());
  });
});
