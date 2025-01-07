import { Dispenser } from '../../domain/models/dispenser';
import { DispenserController } from './dispenser.controller';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { CreateDispenserDto } from './dto/request/create-dispenser.dto';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from '../../domain/models/value-objects/dispenser-flow-volume.value-object';
import mock from 'jest-mock-extended/lib/Mock';
import { DispenserResponseAdapter } from './adapters/dispenser-response.adapter';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';

describe('DispenserController', () => {
  const findDispenserUseCase = mock<FindDispenserUseCase>();
  const createDispenserUseCase = mock<CreateDispenserUseCase>();
  let controller: DispenserController;

  beforeEach(() => {
    controller = new DispenserController(
      findDispenserUseCase,
      createDispenserUseCase,
    );
  });

  it('should throw Error when unhandled exception', async () => {
    const id = DispenserId.create();

    jest
      .spyOn(findDispenserUseCase, 'execute')
      .mockRejectedValue(new Error('omit this message'));

    expect(controller.findById(id.value)).rejects.toThrow('Unexpected error');

    expect(findDispenserUseCase.execute).toHaveBeenCalledWith(id);
  });

  it('should throw Error when dispenser not found', async () => {
    const id = DispenserId.create();

    jest
      .spyOn(findDispenserUseCase, 'execute')
      .mockRejectedValue(new DispenserNotFoundException(id));

    expect(controller.findById(id.value)).rejects.toThrow(
      'Dispenser not found',
    );

    expect(findDispenserUseCase.execute).toHaveBeenCalledWith(id);
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
    const expectedResponse = DispenserResponseAdapter.adapt(
      dispenser.toPrimitives(),
    );

    expect(findDispenserUseCase.execute).toHaveBeenCalledWith(id);
    expect(response).toEqual(expectedResponse);
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
    const expectedResponse = DispenserResponseAdapter.adapt(
      dispenser.toPrimitives(),
    );

    expect(createDispenserUseCase.execute).toHaveBeenCalledWith(flowVolume);
    expect(response).toEqual(expectedResponse);
  });
});
