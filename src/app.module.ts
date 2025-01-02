import { Module } from '@nestjs/common';
import { DispenserModule } from './dispenser/dispenser.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule.forRoot(), MikroOrmModule.forRoot(), DispenserModule],
})
export class AppModule {}
