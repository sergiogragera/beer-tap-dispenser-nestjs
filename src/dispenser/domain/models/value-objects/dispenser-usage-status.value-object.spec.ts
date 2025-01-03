import { DispenserUsageStatus } from './dispenser-usage-status.value-object';

describe('DispenserUsageStatus', () => {
  it('throw Error when close is before open', () => {
    const now = new Date();
    const aMillisecondAgo = new Date(now.getTime() - 1);
    expect(() => DispenserUsageStatus.create(now, aMillisecondAgo)).toThrow(
      'closed datetime must be greater or equal than open datetime',
    );
  });

  it('create valid status usage', () => {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    const closedStatus = DispenserUsageStatus.create(tenSecondsAgo, now);
    expect(closedStatus.openedAt).toEqual(tenSecondsAgo.toLocaleString());
    expect(closedStatus.closedAt).toEqual(now.toLocaleString());
  });
});
