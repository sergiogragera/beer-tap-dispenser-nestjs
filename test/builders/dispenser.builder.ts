import {
  Dispenser,
  DispenserPrimitives,
} from 'src/dispenser/domain/models/dispenser';
import { DispenserFlowVolume } from 'src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserId } from 'src/dispenser/domain/models/value-objects/dispenser-id.value-object';

export class DispenserBuilder {
  private constructor(private dispenserPrimitives: DispenserPrimitives) {}

  static create(
    flowVolume: DispenserFlowVolume,
    id?: DispenserId,
  ): DispenserBuilder {
    return new DispenserBuilder({
      id: id.value ?? DispenserId.create().value,
      flowVolume: flowVolume.value,
    });
  }

  opened(openedAtDate?: Date): this {
    const openedAt = openedAtDate ?? new Date();
    this.dispenserPrimitives.openedAt = openedAt.toLocaleString();
    return this;
  }

  closed(secondsAfterOpen: number): this {
    const openedAt = this.dispenserPrimitives.openedAt
      ? new Date(this.dispenserPrimitives.openedAt)
      : new Date();
    const closedAt = new Date(openedAt.getTime() - secondsAfterOpen * 1000);
    this.dispenserPrimitives.openedAt = openedAt.toLocaleString();
    this.dispenserPrimitives.closedAt = closedAt.toLocaleString();
    return this;
  }

  build(): Dispenser {
    return Dispenser.fromPrimitives(this.dispenserPrimitives);
  }
}
