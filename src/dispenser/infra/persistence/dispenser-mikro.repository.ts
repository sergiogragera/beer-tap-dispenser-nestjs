import { Injectable } from '@nestjs/common';
import { Dispenser } from 'src/dispenser/domain/models/dispenser';
import { DispenserRepository } from 'src/dispenser/domain/persistence/dispenser.repository';
import { DispenserMikroEntity } from './dispenser-mikro.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { DispenserId } from 'src/dispenser/domain/models/value-objects/dispenser-id.value-object';

@Injectable()
export class DispenserMikroRepository implements DispenserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findById(id: DispenserId): Promise<Dispenser> {
    const dispenser = await this.entityManager.findOne(
      DispenserMikroEntity,
      id.value,
    );

    return Dispenser.fromPrimitives(dispenser);
  }

  async save(dispenser: Dispenser): Promise<Dispenser> {
    const savedDispenser = this.entityManager.create(
      DispenserMikroEntity,
      dispenser.toPrimitives(),
    );
    await this.entityManager.persistAndFlush(savedDispenser);

    return Dispenser.fromPrimitives(savedDispenser);
  }
}
