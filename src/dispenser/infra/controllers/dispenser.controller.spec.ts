import { Test, TestingModule } from '@nestjs/testing';
import { DispenserController } from './dispenser.controller';
import { CreateDispenserUseCase } from '../../application/use-cases/create-dispenser.use-case';
import { FindDispenserUseCase } from '../../application/use-cases/find-dispenser.use-case';
import { DispenserMikroRepository } from '../persistence/dispenser-mikro.repository';

describe('DispenserController', () => {
  let controller: DispenserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispenserController],
      providers: [
        FindDispenserUseCase,
        CreateDispenserUseCase,
        {
          provide: 'DispenserRepository',
          useClass: DispenserMikroRepository,
        },
      ],
    }).compile();

    controller = module.get<DispenserController>(DispenserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
