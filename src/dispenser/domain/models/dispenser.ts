import { DispenserStatus } from './value-objects/dispenser-status.value-object';
import { DispenserId } from './value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';
import { DispenserAlreadyOpenedException } from '../exceptions/dispenser-already-opened.exception';
import { DispenserClosedAfterOpenException } from '../exceptions/dispenser-closed-after-open.exception';
import { DispenserAlreadyClosedException } from '../exceptions/dispenser-already-closed.exception';
import { DispenserNotOpenedException } from '../exceptions/dispenser-not-opened.exception';
import { DispenserUsage } from './dispenser-usage';

export interface DispenserPrimitives {
  id: string;
  flowVolume: string;
  openedAt?: string;
  closedAt?: string;
  version?: number;
}

export class Dispenser {
  private _lastUsages: DispenserUsage[];

  constructor(
    readonly id: DispenserId,
    readonly flowVolume: DispenserFlowVolume,
    private _status: DispenserStatus,
    readonly version = 1,
  ) {
    this._lastUsages = [];
  }

  get status(): DispenserStatus {
    return this._status;
  }

  get lastUsages(): DispenserUsage[] {
    return this._lastUsages;
  }

  static create(flowVolume: DispenserFlowVolume) {
    const id = DispenserId.create();
    const openStatus = DispenserStatus.create();

    return new Dispenser(id, flowVolume, openStatus);
  }

  open(openDate = new Date()) {
    if (this.status.isOpened()) {
      throw new DispenserAlreadyOpenedException(this.id);
    } else if (this.status.isClosedAfter(openDate)) {
      throw new DispenserClosedAfterOpenException(this.id);
    }
    this._status = DispenserStatus.create(openDate);
  }

  close(closeDate = new Date()) {
    if (!this.status.isOpened()) {
      throw new DispenserNotOpenedException(this.id);
    } else if (this.status.isOpenedAfter(closeDate)) {
      throw new DispenserAlreadyClosedException(this.id);
    }

    this._status = DispenserStatus.create(this.status.openedAtDate, closeDate);
    this._lastUsages.push(DispenserUsage.create(this));
  }

  toPrimitives(): DispenserPrimitives {
    return {
      id: this.id.value,
      flowVolume: this.flowVolume.value,
      openedAt: this.status.openedAt,
      closedAt: this.status.closedAt,
      version: this.version,
    };
  }

  static fromPrimitives(primitives: DispenserPrimitives): Dispenser {
    return new Dispenser(
      DispenserId.fromString(primitives.id),
      DispenserFlowVolume.fromString(primitives.flowVolume),
      DispenserStatus.create(
        primitives.openedAt ? new Date(primitives.openedAt) : undefined,
        primitives.closedAt ? new Date(primitives.closedAt) : undefined,
      ),
      primitives.version,
    );
  }
}
