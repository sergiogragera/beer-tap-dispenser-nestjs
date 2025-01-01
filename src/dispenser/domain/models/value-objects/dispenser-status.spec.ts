import { DispenserStatus } from './dispenser-status.value-object';

describe('DispenserStatus', () => {
  it('throw Error when close is before open', () => {
    const now = new Date();
    const aMillisecondAgo = new Date(now.getTime() - 1);
    expect(() => DispenserStatus.create(now, aMillisecondAgo)).toThrow(
      'closed datetime must be greater or equal than open datetime',
    );
  });

  it('create valid opened', () => {
    const now = new Date();
    const openedStatus = DispenserStatus.create(now);
    expect(openedStatus.openedAt).toEqual(now.toLocaleString());
    expect(openedStatus.closedAt).toBeUndefined();
  });

  it('create valid closed', () => {
    const now = new Date();
    const aMillisecondAgo = new Date(now.getTime() - 1);
    const openedStatus = DispenserStatus.create(aMillisecondAgo, now);
    expect(openedStatus.openedAt).toEqual(aMillisecondAgo.toLocaleString());
    expect(openedStatus.closedAt).toEqual(now.toLocaleString());
  });
});
