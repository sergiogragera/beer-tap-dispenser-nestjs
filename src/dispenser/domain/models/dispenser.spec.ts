import { Dispenser, DispenserPrimitives } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';

describe('Dispenser', () => {
  it('create valid opened from primitives', () => {
    const dispenserPrimitives: DispenserPrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    };

    const dispenser = Dispenser.fromPrimitives(dispenserPrimitives);
    expect(dispenser.toPrimitives()).toEqual({
      ...dispenserPrimitives,
      closedAt: undefined,
    });
  });

  it('create valid closed from primitives', () => {
    const dispenserPrimitives: DispenserPrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
      closedAt: '1/1/2025, 11:01:22 AM',
    };

    const dispenser = Dispenser.fromPrimitives(dispenserPrimitives);
    expect(dispenser.toPrimitives()).toEqual(dispenserPrimitives);
  });

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
