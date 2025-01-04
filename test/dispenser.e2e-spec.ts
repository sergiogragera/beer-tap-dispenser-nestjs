import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateDispenserDto } from '../src/dispenser/infra/controllers/dto/request/create-dispenser.dto';
import { DispenserFlowVolume } from '../src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserMikroEntity } from '../src/dispenser/infra/persistence/dispenser-mikro.entity';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { DispenserBuilder } from './builders/dispenser.builder';
import { AppModule } from '../src/app.module';

describe('DispenserController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    entityManager = moduleFixture.get(EntityManager).fork();
    await entityManager.nativeDelete(DispenserMikroEntity, {});
    await entityManager.flush();
  });

  afterAll(async () => {
    const orm = app.get(MikroORM);

    await orm.close(true);
    await app.close();
  });

  it('should create dispenser', async () => {
    const createDispenserDto: CreateDispenserDto = {
      flow_volume: '0.00001',
    };

    const response = await request(app.getHttpServer())
      .post('/dispenser')
      .send(createDispenserDto)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      flowVolume: '0.00001',
      openedAt: undefined,
      closedAt: undefined,
    });
  });

  it('sould find dispenser', async () => {
    const dispenser = DispenserBuilder.create(
      DispenserFlowVolume.fromString('0.0001'),
    ).build();

    await entityManager.persistAndFlush([
      entityManager.create(DispenserMikroEntity, dispenser.toPrimitives()),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/dispenser/${dispenser.id.value}`)
      .expect(200);

    expect(response.body).toEqual(dispenser.toPrimitives());
  });
});
