import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserNotFoundException extends Error {
  constructor(id: DispenserId) {
    super(`dispenser with id ${id.value} not found`);
  }
}
