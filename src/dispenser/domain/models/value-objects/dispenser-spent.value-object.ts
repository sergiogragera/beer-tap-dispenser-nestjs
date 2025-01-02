import BigNumber from 'bignumber.js';
import { DispenserFlowVolume } from './dispenser-flow-volume.value-object';

export class DispenserSpent {
  static readonly PRICE_REFERENCE = 12.25;

  private constructor(private readonly _value: BigNumber) {}

  static create(
    flowVolume: DispenserFlowVolume,
    secondsOpened: number,
  ): DispenserSpent {
    const totalSpent = new BigNumber(flowVolume.value)
      .multipliedBy(new BigNumber(this.PRICE_REFERENCE))
      .multipliedBy(new BigNumber(secondsOpened));
    return new DispenserSpent(totalSpent);
  }

  static fromString(stringValue: string): DispenserSpent {
    const totalSpent = new BigNumber(stringValue);
    if (totalSpent.isNaN()) {
      throw new Error('spent must be a number');
    }

    if (totalSpent.isLessThanOrEqualTo(0)) {
      throw new Error('spent must be positive');
    }

    return new DispenserSpent(totalSpent);
  }

  get value(): string {
    return this._value.toString();
  }
}
