import { DispenserStatus } from './dispenser-status.value-object';

describe('DispenserStatus', () => {
  it('throw Error when close is before open', () => {
    const now = new Date();
    const aMillisecondAgo = new Date(now.getTime() - 1);
    expect(() => DispenserStatus.create(now, aMillisecondAgo)).toThrow(
      'closed datetime must be greater or equal than open datetime',
    );
  });

  it('retrieve seconds zero seconds opened when not opened', () => {
    const openedStatus = DispenserStatus.create();
    expect(openedStatus.openedAt).toBeUndefined();
    expect(openedStatus.closedAt).toBeUndefined();
    expect(openedStatus.secondsOpened).toEqual(0);
  });

  it('create valid opened', () => {
    const now = new Date();
    const openedStatus = DispenserStatus.create(now);
    expect(openedStatus.openedAt).toEqual(now.toISOString());
    expect(openedStatus.closedAt).toBeUndefined();
    expect(openedStatus.isOpened()).toBeTruthy();
  });

  it('create valid closed', () => {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    const closedStatus = DispenserStatus.create(tenSecondsAgo, now);
    expect(closedStatus.openedAt).toEqual(tenSecondsAgo.toISOString());
    expect(closedStatus.closedAt).toEqual(now.toISOString());
    expect(closedStatus.secondsOpened).toEqual(10);
    expect(closedStatus.isOpened()).toBeFalsy();

    const aMinuteAgo = new Date(now.getTime() - 60000);
    expect(closedStatus.isOpenedAfter(aMinuteAgo)).toBeTruthy();
    expect(closedStatus.isClosedAfter(aMinuteAgo)).toBeTruthy();
  });
});
