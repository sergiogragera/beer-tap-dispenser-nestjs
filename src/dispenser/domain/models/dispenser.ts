import { AggregateRoot } from '@nestjs/cqrs';
import { DispenserStatus } from './value-objects/dispenser-status.value-object';
import { DispenserId } from './value-objects/dispenser-id.value-object';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';

export interface DispenserPrimitives {
  id: string;
  flowVolume: string;
  openedAt: string;
  closedAt?: string;
}

export class Dispenser extends AggregateRoot {
  constructor(
    private id: DispenserId,
    private flowVolume: DispenserFlowVolume,
    private status: DispenserStatus,
  ) {
    super();
  }

  static create(flowVolume: DispenserFlowVolume) {
    const id = DispenserId.create();
    const openStatus = DispenserStatus.create(new Date());

    return new Dispenser(id, flowVolume, openStatus);
  }

  toPrimitives(): DispenserPrimitives {
    return {
      id: this.id.value,
      flowVolume: this.flowVolume.value,
      openedAt: this.status.openedAt,
      closedAt: this.status.closedAt,
    };
  }

  static fromPrimitives(primitives: DispenserPrimitives): Dispenser {
    return new Dispenser(
      DispenserId.fromString(primitives.id),
      DispenserFlowVolume.fromString(primitives.flowVolume),
      DispenserStatus.create(
        new Date(primitives.openedAt),
        new Date(primitives.closedAt),
      ),
    );
  }
}
