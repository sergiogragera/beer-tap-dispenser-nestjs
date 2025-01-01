import { Dispenser } from '../models/dispenser';

export interface DispenserRepository {
  save(dispenser: Dispenser): Promise<Dispenser>;
}
