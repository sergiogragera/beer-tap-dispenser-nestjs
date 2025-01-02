import { validate } from 'uuid';
import { Uuid } from './uuid.value-object';

describe('Uuid', () => {
  it('throw Error when not valid uuid', () => {
    expect(() => Uuid.fromString('a')).toThrow('id must be a valid uuid v4');
  });

  it('throw Error when empty', () => {
    expect(() => Uuid.fromString('')).toThrow('id must be a valid uuid v4');
  });

  it('create valid dispenser id from string', () => {
    const uuid = Uuid.fromString('381827fb-8ec2-4a3c-a22e-406276a0a829');
    expect(uuid.value).toEqual('381827fb-8ec2-4a3c-a22e-406276a0a829');
  });

  it('create valid dispenser id', () => {
    const uuid = Uuid.create();
    expect(() => validate(uuid.value)).toBeTruthy();
  });
});
