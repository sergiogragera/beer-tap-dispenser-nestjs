import { DispenserFlowVolume } from './dispenser-flow-volume.value-object';
import { DispenserSpent } from './dispenser-spent.value-object';

describe('DispenserSpent', () => {
  it('throw Error when not valid number', () => {
    expect(() => DispenserSpent.fromString('a')).toThrow(
      'spent must be a number',
    );
  });

  it('throw Error when value is not positive', () => {
    expect(() => DispenserSpent.fromString('-0.000001')).toThrow(
      'spent must not be negtive',
    );
  });

  it('create valid spent from primitive', () => {
    const totalSpent = DispenserSpent.fromString('0.0123');
    expect(totalSpent.value).toEqual('0.0123');
  });

  it('create valid spent', () => {
    const flowVolume = DispenserFlowVolume.fromString('0.01');
    const totalSpent = DispenserSpent.create(flowVolume, 10);
    expect(totalSpent.value).toEqual('1.225');
  });
});
