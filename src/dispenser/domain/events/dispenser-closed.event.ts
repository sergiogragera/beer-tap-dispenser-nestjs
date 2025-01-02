import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserClosedEvent {
  constructor(readonly dispenserId: DispenserId) {}
}
