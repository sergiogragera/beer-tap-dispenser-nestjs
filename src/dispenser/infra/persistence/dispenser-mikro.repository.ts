import { Injectable } from '@nestjs/common';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserMikroEntity } from './dispenser-mikro.entity';
import { EntityManager, OptimisticLockError } from '@mikro-orm/postgresql';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserUsageMikroEntity } from './dispenser-usage-mikro.entity';
import { DispenserAlreadyClosedException } from '../../domain/exceptions/dispenser-already-closed.exception';
import { DispenserAlreadyOpenedException } from '../../domain/exceptions/dispenser-already-opened.exception';

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
    this.entityManager.persist(updateDispenser);

    for (const usage of dispenser.lastUsages) {
      const savedUsage = this.entityManager.create(
        DispenserUsageMikroEntity,
        usage.toPrimitives(),
      );
      this.entityManager.persist(savedUsage);
    }

    try {
      await this.entityManager.flush();
    } catch (error) {
      if (error instanceof OptimisticLockError) {
        if (dispenser.status.closedAtDate !== undefined) {
          throw new DispenserAlreadyClosedException(dispenser.id);
        }
        throw new DispenserAlreadyOpenedException(dispenser.id);
      }
    }

    return Dispenser.fromPrimitives(updateDispenser);
  }
}
