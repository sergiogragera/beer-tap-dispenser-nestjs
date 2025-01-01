import BigNumber from 'bignumber.js';

export class DispenserFlowVolume {
  private constructor(private readonly _value: BigNumber) {}

  static fromString(stringValue: string): DispenserFlowVolume {
    const flowVolume = new BigNumber(stringValue);
    if (flowVolume.isNaN()) {
      throw new Error('flow volume must be a number');
    }

    if (flowVolume.isLessThanOrEqualTo(0)) {
      throw new Error('flow volume must be positive');
    }

    return new DispenserFlowVolume(flowVolume);
  }

  get value(): string {
    return this._value.toString();
  }
}
