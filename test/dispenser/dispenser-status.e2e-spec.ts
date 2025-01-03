import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Dispenser } from '../../src/dispenser/domain/models/dispenser';
import { DispenserFlowVolume } from '../../src/dispenser/domain/models/value-objects/dispenser-flow-volume.value-object';
import { DispenserMikroEntity } from '../../src/dispenser/infra/persistence/dispenser-mikro.entity';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { UpdateStatusDispenserDto } from 'src/dispenser/infra/controllers/dto/update-status-dispenser.dto';
import { DispenserStatus } from '../../src/dispenser/domain/enums/dispenser-status.enum';
import { DispenserUsageMikroEntity } from '../../src/dispenser/infra/persistence/dispenser-usage-mikro.entity';
import { AppModule } from '../../src/app.module';

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

  it('/dispenser/:id/status (PUT)', async () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

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
});
