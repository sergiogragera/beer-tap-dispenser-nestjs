import { DecimalType, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Dispenser {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: DecimalType })
  flowVolume: string;

  @Property()
  openedAt: number;

  @Property()
  closedAt: number;
}
