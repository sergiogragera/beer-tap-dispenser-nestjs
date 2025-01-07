import { DispenserUsageNotClosedException } from '../exceptions/dispenser-usage-not-closed.exception';
import { Dispenser } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';
import { DispenserId } from './value-objects/dispenser-id.value-object';
import { DispenserSpent } from './value-objects/dispenser-spent.value-object';
import { DispenserUsageId } from './value-objects/dispenser-usage-id.value-object';
import { DispenserUsageStatus } from './value-objects/dispenser-usage-status.value-object';

export interface DispenserUsagePrimitives {
  id: string;
  dispenserId: string;
  flowVolume: string;
  totalSpent: string;
  openedAt: string;
  closedAt: string;
}

export class DispenserUsage {
  private constructor(
    readonly id: DispenserUsageId,
    readonly dispenserId: DispenserId,
    readonly flowVolume: DispenserFlowVolume,
    readonly status: DispenserUsageStatus,
    private _totalSpent: DispenserSpent,
  ) {}

  get totalSpent(): DispenserSpent {
    return this._totalSpent;
  }

  static create(dispenser: Dispenser) {
    if (!dispenser.status.openedAtDate || !dispenser.status.closedAtDate) {
      throw new DispenserUsageNotClosedException(dispenser.id);
    }

    const id = DispenserUsageId.create();
    const totalSpent = DispenserSpent.create(
      dispenser.flowVolume,
      dispenser.status.secondsOpened,
    );
    const status = DispenserUsageStatus.create(
      dispenser.status.openedAtDate,
      dispenser.status.closedAtDate,
    );

    return new DispenserUsage(
      id,
      dispenser.id,
      dispenser.flowVolume,
      status,
      totalSpent,
    );
  }

  toPrimitives(): DispenserUsagePrimitives {
    return {
      id: this.id.value,
      dispenserId: this.dispenserId.value,
      flowVolume: this.flowVolume.value,
      totalSpent: this.totalSpent.value,
      openedAt: this.status.openedAt,
      closedAt: this.status.closedAt,
    };
  }

  static fromPrimitives(primitives: DispenserUsagePrimitives): DispenserUsage {
    return new DispenserUsage(
      DispenserUsageId.fromString(primitives.id),
      DispenserId.fromString(primitives.dispenserId),
      DispenserFlowVolume.fromString(primitives.flowVolume),
      DispenserUsageStatus.create(
        new Date(primitives.openedAt),
        new Date(primitives.closedAt),
      ),
      DispenserSpent.fromString(primitives.totalSpent),
    );
  }
}
