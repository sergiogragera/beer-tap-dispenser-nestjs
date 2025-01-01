import { DispenserId } from './dispenser-id.value-object';
import { validate } from 'uuid';

describe('DispenserId', () => {
  it('throw Error when not valid uuid', () => {
    expect(() => DispenserId.fromString('a')).toThrow(
      'id must be a valid uuid v4',
    );
  });

  it('throw Error when empty', () => {
    expect(() => DispenserId.fromString('')).toThrow(
      'id must be a valid uuid v4',
    );
  });

  it('create valid dispenser id from string', () => {
    const dispenserId = DispenserId.fromString(
      '381827fb-8ec2-4a3c-a22e-406276a0a829',
    );
    expect(dispenserId.value).toEqual('381827fb-8ec2-4a3c-a22e-406276a0a829');
  });

  it('create valid dispenser id', () => {
    const dispenserId = DispenserId.create();
    expect(() => validate(dispenserId.value)).toBeTruthy();
  });
});
