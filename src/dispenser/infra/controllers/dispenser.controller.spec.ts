import { Test, TestingModule } from '@nestjs/testing';
import { DispenserController } from './dispenser.controller';

describe('DispenserController', () => {
  let controller: DispenserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispenserController],
    }).compile();

    controller = module.get<DispenserController>(DispenserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
