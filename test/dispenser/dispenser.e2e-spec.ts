import config from '../../mikro-orm.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DispenserModule } from '../../src/dispenser/dispenser.module';
import { CreateDispenserDto } from '../../src/dispenser/domain/dto/create-dispenser.dto';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Dispenser } from '../../src/dispenser/domain/models/dispenser';
import { DispenserFlowVolume } from '../../src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserMikroEntity } from '../../src/dispenser/infra/persistence/dispenser-mikro.entity';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';

describe('DispenserController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(config), DispenserModule],
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

  it('/dispenser (POST)', async () => {
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
      openedAt: expect.any(String),
      closedAt: undefined,
    });
  });

  it('/dispenser/:id (GET)', async () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );
    await entityManager.persistAndFlush([
      entityManager.create(DispenserMikroEntity, dispenser.toPrimitives()),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/dispenser/${dispenser.id.value}`)
      .expect(200);

    expect(response.body).toEqual(dispenser.toPrimitives());
  });
});
