import { Dispenser } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserStatusController } from './dispenser-status.controller';
import { UpdateStatusDispenserUseCase } from '../../application/use-cases/update-status-dispenser.use-case';
import { UpdateStatusDispenserDto } from './dto/request/update-status-dispenser.dto';
import { DispenserStatus } from '../../domain/enums/dispenser-status.enum';
import mock from 'jest-mock-extended/lib/Mock';
import { DispenserAlreadyOpenedException } from '../../domain/exceptions/dispenser-already-opened.exception';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { DispenserResponseAdapter } from './adapters/dispenser-response.adapter';

describe('DispenserStatusController', () => {
  const useCase = mock<UpdateStatusDispenserUseCase>();
  let controller: DispenserStatusController;

  beforeEach(() => {
    controller = new DispenserStatusController(useCase);
  });

  it('should throw Error when dispenser already open/close', async () => {
    const id = DispenserId.create();

    const now = new Date();
    const updateStatusDto: UpdateStatusDispenserDto = {
      status: DispenserStatus.OPEN,
      updated_at: now.toISOString(),
    };

    jest
      .spyOn(useCase, 'execute')
      .mockRejectedValue(new DispenserAlreadyOpenedException(id));

    expect(controller.updateStatus(id.value, updateStatusDto)).rejects.toThrow(
      'Dispenser is already opened/closed',
    );

    expect(useCase.execute).toHaveBeenCalledWith(id, DispenserStatus.OPEN, now);
  });

  it('should throw Error when dispenser not found', async () => {
    const id = DispenserId.create();

    const now = new Date();
    const updateStatusDto: UpdateStatusDispenserDto = {
      status: DispenserStatus.OPEN,
      updated_at: now.toISOString(),
    };

    jest
      .spyOn(useCase, 'execute')
      .mockRejectedValue(new DispenserNotFoundException(id));

    expect(controller.updateStatus(id.value, updateStatusDto)).rejects.toThrow(
      'Dispenser not found',
    );

    expect(useCase.execute).toHaveBeenCalledWith(id, DispenserStatus.OPEN, now);
  });

  it('should update dispenser status', async () => {
    const id = DispenserId.create();

    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.00001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    const now = new Date();
    const updateStatusDto: UpdateStatusDispenserDto = {
      status: DispenserStatus.OPEN,
      updated_at: now.toISOString(),
    };

    jest.spyOn(useCase, 'execute').mockResolvedValue(dispenser.toPrimitives());

    const response = await controller.updateStatus(id.value, updateStatusDto);
    const expectedResponse = DispenserResponseAdapter.adapt(
      dispenser.toPrimitives(),
    );

    expect(useCase.execute).toHaveBeenCalledWith(id, DispenserStatus.OPEN, now);
    expect(response).toEqual(expectedResponse);
  });
});
