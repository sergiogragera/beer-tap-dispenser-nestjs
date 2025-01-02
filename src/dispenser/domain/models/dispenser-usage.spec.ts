import { Dispenser } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';
import { DispenserUsage, DispenserUsagePrimitives } from './dispenser-usage';
import { DispenserAlreadyOpenedException } from '../exceptions/dispenser-already-opened.exception';

describe('DispenserUsage', () => {
  it('create valid usage from primitives', () => {
    const usagePrimitives: DispenserUsagePrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      dispenserId: '329f86bb-f528-42b9-a7ea-0851fea715fe',
      flowVolume: '0.1',
      openedAt: '1/1/2025, 10:59:35 AM',
      closedAt: '1/1/2025, 11:05:23 AM',
      totalSpent: '32.43',
    };

    const usage = DispenserUsage.fromPrimitives(usagePrimitives);
    expect(usage.toPrimitives()).toEqual(usagePrimitives);
  });

  it('throw Error when create usage from null dispenser', () => {
    const dispenser = Dispenser.create(DispenserFlowVolume.fromString('1'));
    dispenser.open();

    expect(() => DispenserUsage.create(null)).toThrow(
      'dispenser must not be null',
    );
  });

  it('throw Error when create usage from not closed dispenser', () => {
    const dispenser = Dispenser.create(DispenserFlowVolume.fromString('1'));
    dispenser.open();

    expect(() => DispenserUsage.create(dispenser)).toThrow(
      'dispenser must be closed',
    );
  });

  it('create valid usage', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(DispenserFlowVolume.fromString('0.235'));
    dispenser.open(aMinuteAgo);
    dispenser.close(now);

    const usage = DispenserUsage.create(dispenser);

    expect(usage.toPrimitives()).toEqual({
      id: expect.any(String),
      dispenserId: expect.any(String),
      flowVolume: '0.235',
      openedAt: aMinuteAgo.toLocaleString(),
      closedAt: now.toLocaleString(),
      totalSpent: '172.725',
    });
  });
});
