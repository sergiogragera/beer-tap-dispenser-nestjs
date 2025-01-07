import { Module } from '@nestjs/common';
import { DispenserController } from './infra/controllers/dispenser.controller';
import { CreateDispenserUseCase } from './application/use-cases/create-dispenser.use-case';
import { DispenserMikroRepository } from './infra/persistence/dispenser-mikro.repository';
import { FindDispenserUseCase } from './application/use-cases/find-dispenser.use-case';
import { UpdateStatusDispenserUseCase } from './application/use-cases/update-status-dispenser.use-case';
import { DispenserStatusController } from './infra/controllers/dispenser-status.controller';
import { DispenserUsageMikroRepository } from './infra/persistence/dispenser-usage-mikro.repository';
import { FindDispenserSpendingsUseCase } from './application/use-cases/find-dispenser-spendings.use-case';
import { DispenserSpendingController } from './infra/controllers/dispenser-spending.controller';

@Module({
  controllers: [
    DispenserController,
    DispenserStatusController,
    DispenserSpendingController,
  ],
  providers: [
    FindDispenserUseCase,
    FindDispenserSpendingsUseCase,
    CreateDispenserUseCase,
    UpdateStatusDispenserUseCase,
    {
      provide: 'DispenserRepository',
      useClass: DispenserMikroRepository,
    },
    {
      provide: 'DispenserUsageRepository',
      useClass: DispenserUsageMikroRepository,
    },
  ],
})
export class DispenserModule {}
