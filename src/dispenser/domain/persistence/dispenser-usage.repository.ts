import { DispenserUsage } from '../models/dispenser-usage';
import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export interface DispenserUsageRepository {
  findAll(id: DispenserId): Promise<DispenserUsage[]>;
}
