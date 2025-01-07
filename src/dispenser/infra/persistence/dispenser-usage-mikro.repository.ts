import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserUsageMikroEntity } from './dispenser-usage-mikro.entity';
import { DispenserUsage } from '../../domain/models/dispenser-usage';
import { DispenserUsageRepository } from '../../domain/persistence/dispenser-usage.repository';

@Injectable()
export class DispenserUsageMikroRepository implements DispenserUsageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findAll(id: DispenserId): Promise<DispenserUsage[]> {
    const usages = await this.entityManager.find(DispenserUsageMikroEntity, {
      dispenserId: id.value,
    });

    return usages.map((usage) => DispenserUsage.fromPrimitives(usage));
  }
}
