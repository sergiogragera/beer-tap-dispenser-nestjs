import { Module } from '@nestjs/common';
import { DispenserModule } from './dispenser/dispenser.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forRoot(), DispenserModule],
})
export class AppModule {}
