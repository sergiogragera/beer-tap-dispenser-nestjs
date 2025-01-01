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

  it('should return an opened dispenser', async () => {
    const dispenser = Dispenser.fromPrimitives({
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    jest.spyOn(repository, 'save').mockResolvedValue(dispenser);

    const response = await useCase.execute({
      flow_volume: '0.0001',
    });

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(DispenserId),
        flowVolume: DispenserFlowVolume.fromString('0.0001'),
        status: expect.any(DispenserStatus),
      }),
    );
    expect(response).toEqual(dispenser.toPrimitives());
  });
});
