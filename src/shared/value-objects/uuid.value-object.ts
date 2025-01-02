import { v4, validate } from 'uuid';

export class Uuid {
  protected constructor(private readonly _value: string) {}

  static create(): Uuid {
    return new Uuid(v4());
  }

  static fromString(id: string): Uuid {
    if (!validate(id)) {
      throw new Error('id must be a valid uuid v4');
    }
    return new Uuid(id);
  }

  get value(): string {
    return this._value;
  }
}
