import { Test, TestingModule } from '@nestjs/testing';
import { DispenserService } from './dispenser.service';

describe('DispenserService', () => {
  let service: DispenserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispenserService],
    }).compile();

    service = module.get<DispenserService>(DispenserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
