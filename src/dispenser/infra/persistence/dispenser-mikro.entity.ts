import {
  DateTimeType,
  DecimalType,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DispenserPrimitives } from 'src/dispenser/domain/models/dispenser';

@Entity({ tableName: 'dispenser' })
export class DispenserMikroEntity implements DispenserPrimitives {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ version: true, default: 1 })
  version?: number;

  @Property({ type: DecimalType, precision: 32, columnType: 'decimal' })
  flowVolume!: string;

  @Property({ type: DateTimeType, nullable: true })
  openedAt?: string;

  @Property({ type: DateTimeType, nullable: true })
  closedAt?: string;
}
