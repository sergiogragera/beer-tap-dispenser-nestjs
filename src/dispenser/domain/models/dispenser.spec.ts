import { Dispenser } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';

describe('Dispenser', () => {
  it('create valid opened', () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );
    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: expect.any(String),
      closedAt: undefined,
    });
  });
});
