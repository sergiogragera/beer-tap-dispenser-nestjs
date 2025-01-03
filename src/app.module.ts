import { Module } from '@nestjs/common';
import { DispenserModule } from './dispenser/dispenser.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import config from '../mikro-orm.config';

@Module({
  imports: [
    CqrsModule.forRoot(),
    MikroOrmModule.forRoot(config),
    DispenserModule,
  ],
})
export class AppModule {}
