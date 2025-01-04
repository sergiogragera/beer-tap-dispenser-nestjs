import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DispenserFlowVolume } from '../src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserMikroEntity } from '../src/dispenser/infra/persistence/dispenser-mikro.entity';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { UpdateStatusDispenserDto } from 'src/dispenser/infra/controllers/dto/request/update-status-dispenser.dto';
import { DispenserStatus } from '../src/dispenser/domain/enums/dispenser-status.enum';
import { DispenserUsageMikroEntity } from '../src/dispenser/infra/persistence/dispenser-usage-mikro.entity';
import { AppModule } from '../src/app.module';
import { DispenserBuilder } from './builders/dispenser.builder';

describe('DispenserStatusController (e2e)', () => {
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
    await entityManager.nativeDelete(DispenserUsageMikroEntity, {});
    await entityManager.flush();
  });

  afterAll(async () => {
    const orm = app.get(MikroORM);

    await orm.close(true);
    await app.close();
  });

  it('should open dispenser when dispenser is not opened', async () => {
    const dispenser = DispenserBuilder.create(
      DispenserFlowVolume.fromString('0.0001'),
    ).build();

    await entityManager.persistAndFlush([
      entityManager.create(DispenserMikroEntity, dispenser.toPrimitives()),
    ]);

    const updateStatusDto: UpdateStatusDispenserDto = {
      status: DispenserStatus.OPEN,
      updated_at: new Date().toISOString(),
    };

    const response = await request(app.getHttpServer())
      .put(`/dispenser/${dispenser.id.value}/status`)
      .send(updateStatusDto)
      .expect(200);

    expect(response.body).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: expect.any(String),
      closedAt: undefined,
    });
  });

  it('should close dispenser when dispenser is opened', async () => {
    const dispenser = DispenserBuilder.create(
      DispenserFlowVolume.fromString('0.0001'),
    )
      .opened()
      .build();

    await entityManager.persistAndFlush([
      entityManager.create(DispenserMikroEntity, dispenser.toPrimitives()),
    ]);

    const updateStatusDto: UpdateStatusDispenserDto = {
      status: DispenserStatus.CLOSE,
      updated_at: new Date().toISOString(),
    };

    const response = await request(app.getHttpServer())
      .put(`/dispenser/${dispenser.id.value}/status`)
      .send(updateStatusDto)
      .expect(200);

    expect(response.body).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: expect.any(String),
      closedAt: expect.any(String),
    });
  });
});
