import { Module } from '@nestjs/common';
import { DispenserController } from './infra/controllers/dispenser.controller';
import { CreateDispenserUseCase } from './application/use-cases/create-dispenser.use-case';
import { DispenserMikroRepository } from './infra/persistence/dispenser-mikro.repository';
import { FindDispenserUseCase } from './application/use-cases/find-dispenser.use-case';
import { UpdateStatusDispenserUseCase } from './application/use-cases/update-status-dispenser.use-case';
import { DispenserStatusController } from './infra/controllers/dispenser-status.controller';

@Module({
  controllers: [DispenserController, DispenserStatusController],
  providers: [
    FindDispenserUseCase,
    CreateDispenserUseCase,
    UpdateStatusDispenserUseCase,
    {
      provide: 'DispenserRepository',
      useClass: DispenserMikroRepository,
    },
  ],
})
export class DispenserModule {}
