import { Injectable } from '@nestjs/common';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserMikroEntity } from './dispenser-mikro.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';

@Injectable()
export class DispenserMikroRepository implements DispenserRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findById(id: DispenserId): Promise<Dispenser | null> {
    const dispenser = await this.entityManager.findOne(
      DispenserMikroEntity,
      id.value,
    );

    if (!dispenser) return null;

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

  async update(dispenser: Dispenser): Promise<Dispenser> {
    const dispenserMikro: DispenserMikroEntity = dispenser.toPrimitives();
    let updateDispenser = this.entityManager.getReference(
      DispenserMikroEntity,
      dispenserMikro.id,
    );

    updateDispenser = this.entityManager.assign(
      updateDispenser,
      dispenserMikro,
    );
    this.entityManager.persistAndFlush(updateDispenser);

    return Dispenser.fromPrimitives(updateDispenser);
  }
}
