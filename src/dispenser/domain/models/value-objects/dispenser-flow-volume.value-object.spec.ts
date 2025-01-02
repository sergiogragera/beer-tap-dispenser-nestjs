import { DispenserFlowVolume } from './dispenser-flow-volume.value-object';

describe('DispenserFlowVolume', () => {
  it('throw Error when not valid number', () => {
    expect(() => DispenserFlowVolume.fromString('a')).toThrow(
      'flow volume must be a number',
    );
  });

  it('throw Error when value is not positive', () => {
    expect(() => DispenserFlowVolume.fromString('0.00')).toThrow(
      'flow volume must be positive',
    );
  });

  it('create valid dispenser from primitive', () => {
    const flowVolume = DispenserFlowVolume.fromString('0.0001');
    expect(flowVolume.value).toEqual('0.0001');
  });
});
