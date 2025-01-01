import { Dispenser } from '../models/dispenser';
import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export interface DispenserRepository {
  findById(id: DispenserId): Promise<Dispenser>;
  save(dispenser: Dispenser): Promise<Dispenser>;
  update(dispenser: Dispenser): Promise<Dispenser>;
}
