import { Dispenser } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';
import { DispenserUsage, DispenserUsagePrimitives } from './dispenser-usage';
import { DispenserUsageNotClosedException } from '../exceptions/dispenser-usage-not-closed.exception';

describe('DispenserUsage', () => {
  it('create valid usage from primitives', () => {
    const usagePrimitives: DispenserUsagePrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      dispenserId: '329f86bb-f528-42b9-a7ea-0851fea715fe',
      flowVolume: '0.1',
      openedAt: '2025-01-01T10:59:35.000Z',
      closedAt: '2025-01-01T11:05:23.000Z',
      totalSpent: '32.43',
    };

    const usage = DispenserUsage.fromPrimitives(usagePrimitives);
    expect(usage.toPrimitives()).toEqual(usagePrimitives);
  });

  it('throw DispenserUsageNotClosedException when create usage from not closed dispenser', () => {
    const dispenser = Dispenser.create(DispenserFlowVolume.fromString('1'));
    dispenser.open();

    expect(() => DispenserUsage.create(dispenser)).toThrow(
      DispenserUsageNotClosedException,
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
      openedAt: aMinuteAgo.toISOString(),
      closedAt: now.toISOString(),
      totalSpent: '172.725',
    });
  });
});
