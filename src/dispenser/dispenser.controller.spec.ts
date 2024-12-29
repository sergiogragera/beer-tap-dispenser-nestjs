import { Test, TestingModule } from '@nestjs/testing';
import { DispenserController } from './dispenser.controller';
import { DispenserService } from './dispenser.service';

describe('DispenserController', () => {
  let controller: DispenserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispenserController],
      providers: [DispenserService],
    }).compile();

    controller = module.get<DispenserController>(DispenserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
