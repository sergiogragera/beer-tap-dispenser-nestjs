import { Module } from '@nestjs/common';
import { DispenserService } from './dispenser.service';
import { DispenserController } from './dispenser.controller';

@Module({
  controllers: [DispenserController],
  providers: [DispenserService],
})
export class DispenserModule {}
