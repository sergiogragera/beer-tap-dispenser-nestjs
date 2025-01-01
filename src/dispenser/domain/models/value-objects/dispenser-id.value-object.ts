import { v4, validate } from 'uuid';

export class DispenserId {
  private constructor(private readonly _value: string) {}

  static create(): DispenserId {
    return new DispenserId(v4());
  }

  static fromString(id: string): DispenserId {
    if (!validate(id)) {
      throw new Error('id must be a valid uuid v4');
    }
    return new DispenserId(id);
  }

  get value(): string {
    return this._value;
  }
}
