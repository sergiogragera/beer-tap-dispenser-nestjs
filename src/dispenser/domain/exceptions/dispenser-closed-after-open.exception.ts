import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserClosedAfterOpenException extends Error {
  constructor(id: DispenserId) {
    super(`dispenser with id ${id.value} is closed after open date`);
  }
}
