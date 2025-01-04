import { Migration } from '@mikro-orm/migrations';

export class Migration20250104200452 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "dispenser" ("id" uuid not null, "flow_volume" decimal not null, "opened_at" timestamptz null, "closed_at" timestamptz null, constraint "dispenser_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "usage" ("id" uuid not null, "dispenser_id" uuid not null, "flow_volume" decimal not null, "total_spent" decimal not null, "opened_at" timestamptz not null, "closed_at" timestamptz not null, constraint "usage_pkey" primary key ("id", "dispenser_id"));`,
    );
  }
}
