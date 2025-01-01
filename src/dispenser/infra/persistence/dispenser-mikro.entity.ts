import {
  DateTimeType,
  DecimalType,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({ tableName: 'dispenser' })
export class DispenserMikroEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: DecimalType, precision: 32, columnType: 'decimal' })
  flowVolume: string;

  @Property({ type: DateTimeType })
  openedAt: string;

  @Property({ type: DateTimeType, nullable: true })
  closedAt?: string;
}
