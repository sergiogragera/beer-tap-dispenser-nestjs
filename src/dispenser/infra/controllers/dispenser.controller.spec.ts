import { Test, TestingModule } from '@nestjs/testing';
import { DispenserController } from './dispenser.controller';
import { CreateDispenserUseCase } from 'src/dispenser/application/use-cases/create-dispenser.use-case';
import { FindDispenserUseCase } from 'src/dispenser/application/use-cases/find-dispenser.use-case';

describe('DispenserController', () => {
  let controller: DispenserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispenserController],
      providers: [FindDispenserUseCase, CreateDispenserUseCase],
    }).compile();

    controller = module.get<DispenserController>(DispenserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
