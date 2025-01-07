import { DispenserAlreadyOpenedException } from '../exceptions/dispenser-already-opened.exception';
import { DispenserClosedAfterOpenException } from '../exceptions/dispenser-closed-after-open.exception';
import { DispenserNotOpenedException } from '../exceptions/dispenser-not-opened.exception';
import { DispenserAlreadyClosedException } from '../exceptions/dispenser-already-closed.exception';
import { Dispenser, DispenserPrimitives } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';

describe('Dispenser', () => {
  it('create valid opened from primitives', () => {
    const dispenserPrimitives: DispenserPrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '2025-01-01T10:59:35.000Z',
    };

    const dispenser = Dispenser.fromPrimitives(dispenserPrimitives);
    expect(dispenser.toPrimitives()).toEqual({
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      version: 1,
      flowVolume: '0.0001',
      openedAt: '2025-01-01T10:59:35.000Z',
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
    expect(dispenser.toPrimitives()).toEqual({
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      version: 1,
      flowVolume: '0.0001',
      openedAt: '2025-01-01T10:59:35.000Z',
      closedAt: '2025-01-01T11:01:22.000Z',
    });
  });

  it('create valid dispenser', () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );
    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      version: 1,
      flowVolume: '0.0001',
      openedAt: undefined,
      closedAt: undefined,
    });
  });

  it('throw error when open already opened dispenser', () => {
    const now = new Date();

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(() => dispenser.open()).toThrow(DispenserAlreadyOpenedException);
  });

  it('throw error when open before close date dispenser', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(aMinuteAgo);
    dispenser.close(now);

    expect(() => dispenser.open(aMinuteAgo)).toThrow(
      DispenserClosedAfterOpenException,
    );
  });

  it('open dispenser', () => {
    const now = new Date();

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(dispenser.lastUsages).toHaveLength(0);
    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      version: 1,
      flowVolume: '0.0001',
      openedAt: now.toISOString(),
      closedAt: undefined,
    });
  });

  it('throw error when close not opened dispenser', () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    expect(() => dispenser.close()).toThrow(DispenserNotOpenedException);
  });

  it('throw error when close already closed dispenser', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(() => dispenser.close(aMinuteAgo)).toThrow(
      DispenserAlreadyClosedException,
    );
  });

  it('close dispenser', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(aMinuteAgo);
    dispenser.close(now);

    expect(dispenser.lastUsages).toHaveLength(1);
    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      version: 1,
      flowVolume: '0.0001',
      openedAt: aMinuteAgo.toISOString(),
      closedAt: now.toISOString(),
    });
  });
});
