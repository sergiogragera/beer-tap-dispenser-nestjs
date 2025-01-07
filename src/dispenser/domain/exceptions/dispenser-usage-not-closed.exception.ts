import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserUsageNotClosedException extends Error {
  constructor(id: DispenserId) {
    super(`dispenser with ${id.value} must be closed`);
  }
}
