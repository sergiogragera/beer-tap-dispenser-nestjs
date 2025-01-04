import {
  DateTimeType,
  DecimalType,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DispenserUsagePrimitives } from 'src/dispenser/domain/models/dispenser-usage';

@Entity({ tableName: 'usage' })
export class DispenserUsageMikroEntity implements DispenserUsagePrimitives {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @PrimaryKey({ type: 'uuid' })
  dispenserId!: string;

  @Property({ type: DecimalType, precision: 32, columnType: 'decimal' })
  flowVolume!: string;

  @Property({ type: DecimalType, precision: 32, columnType: 'decimal' })
  totalSpent!: string;

  @Property({ type: DateTimeType })
  openedAt!: string;

  @Property({ type: DateTimeType })
  closedAt!: string;
}
