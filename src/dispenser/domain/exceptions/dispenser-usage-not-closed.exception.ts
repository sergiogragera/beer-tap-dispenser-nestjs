export class DispenserUsageNotClosedException extends Error {
  constructor() {
    super(`usage is not closed`);
  }
}
