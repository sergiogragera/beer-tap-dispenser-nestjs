import { Dispenser } from '../../domain/models/dispenser';
import { DispenserController } from './dispenser.controller';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { CreateDispenserDto } from '../../domain/dto/create-dispenser.dto';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';

describe('DispenserController', () => {
  let findDispenserUseCase: FindDispenserUseCase;
  let createDispenserUseCase: CreateDispenserUseCase;
  let controller: DispenserController;

  beforeEach(() => {
    findDispenserUseCase = new FindDispenserUseCase(null);
    createDispenserUseCase = new CreateDispenserUseCase(null);
    controller = new DispenserController(
      findDispenserUseCase,
      createDispenserUseCase,
    );
  });

  it('should return dispenser', async () => {
    const id = DispenserId.create();

    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.00001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    jest
      .spyOn(findDispenserUseCase, 'execute')
      .mockResolvedValue(dispenser.toPrimitives());

    const response = await controller.findById(id.value);

    expect(findDispenserUseCase.execute).toHaveBeenCalledWith(id);
    expect(response).toEqual(dispenser.toPrimitives());
  });

  it('should create an opened dispenser', async () => {
    const flowVolume = DispenserFlowVolume.fromString('0.00001');

    const createDispenserDto: CreateDispenserDto = {
      flow_volume: flowVolume.value,
    };

    const dispenser = Dispenser.create(flowVolume);

    jest
      .spyOn(createDispenserUseCase, 'execute')
      .mockResolvedValue(dispenser.toPrimitives());

    const response = await controller.create(createDispenserDto);

    expect(createDispenserUseCase.execute).toHaveBeenCalledWith(flowVolume);
    expect(response).toEqual(dispenser.toPrimitives());
  });
});
