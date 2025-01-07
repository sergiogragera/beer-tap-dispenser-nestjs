import { Module } from '@nestjs/common';
import { DispenserModule } from './dispenser/dispenser.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config), DispenserModule],
})
export class AppModule {}
