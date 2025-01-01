import { Module } from '@nestjs/common';
import { DispenserController } from './infra/controllers/dispenser.controller';
import { CreateDispenserUseCase } from './application/use-cases/create-dispenser.use-case';
import { DispenserMikroRepository } from './infra/persistence/dispenser-mikro.repository';
import { FindDispenserUseCase } from './application/use-cases/find-dispenser.use-case';
import { OpenDispenserUseCase } from './application/use-cases/open-dispenser.use-case';
import { CloseDispenserUseCase } from './application/use-cases/close-dispenser.use-case';

@Module({
  controllers: [DispenserController],
  providers: [
    FindDispenserUseCase,
    CreateDispenserUseCase,
    OpenDispenserUseCase,
    CloseDispenserUseCase,
    {
      provide: 'DispenserRepository',
      useClass: DispenserMikroRepository,
    },
  ],
})
export class DispenserModule {}
