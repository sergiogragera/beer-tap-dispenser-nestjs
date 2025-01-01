import { Module } from '@nestjs/common';
import { DispenserController } from './infra/controllers/dispenser.controller';
import { CreateDispenserUseCase } from './application/use-cases/create-dispenser.service';
import { DispenserMikroRepository } from './infra/persistence/dispenser-mikro.repository';

@Module({
  controllers: [DispenserController],
  providers: [
    CreateDispenserUseCase,
    {
      provide: 'DispenserRepository',
      useClass: DispenserMikroRepository,
    },
  ],
})
export class DispenserModule {}
