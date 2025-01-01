import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserOpenedAfterCloseException extends Error {
  constructor(id: DispenserId) {
    super(`dispenser with id ${id.value} is opened after close date`);
  }
}
