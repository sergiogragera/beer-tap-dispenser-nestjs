import { binding, then, when, before, given } from 'cucumber-tsflow';
import { assert } from 'chai';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreateDispenserDto } from '../../../src/dispenser/infra/controllers/dto/request/create-dispenser.dto';
import { UpdateStatusDispenserDto } from '../../../src/dispenser/infra/controllers/dto/request/update-status-dispenser.dto';
import { DispenserStatus } from '../../../src/dispenser/domain/enums/dispenser-status.enum';

class Context {
  public app!: INestApplication;
  public response: any;
}

@binding([Context])
export class DispenserSteps {
  constructor(protected context: Context) {}

  @before()
  public async before(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.context.app = moduleFixture.createNestApplication();
    await this.context.app.init();
  }

  @given(/the dispenser exists/)
  public async theDispenserExists() {
    this.context.response = await this.createDispenser();
  }

  @given(/the user open the dispenser( ([0-9]+) seconds? ago)?/)
  public async theUserOpenTheDispenserSecondsAgo(secondsAgo: number) {
    const updateStatusRequest: UpdateStatusDispenserDto = {
      status: DispenserStatus.OPEN,
    };

    this.context.response = await this.updateStatusDispenser(
      updateStatusRequest,
      secondsAgo,
    );
  }

  @given(/the user close the dispenser( ([0-9]+) seconds? ago)?/)
  public async theUserCloseTheDispenser(secondsAgo: number) {
    const updateStatusRequest: UpdateStatusDispenserDto = {
      status: DispenserStatus.CLOSE,
    };

    this.context.response = await this.updateStatusDispenser(
      updateStatusRequest,
      secondsAgo,
    );
  }

  @given(/the user gets the created dispenser spendings/)
  public async theUserGetsCreatedDispenserSpendings() {
    const dispenserId = this.context.response.body.id;
    this.context.response = await request(this.context.app.getHttpServer()).get(
      `/dispenser/${dispenserId}/spending`,
    );
  }

  @when(/the user creates a dispenser/)
  public async theUserCreatesADispenser() {
    this.context.response = await this.createDispenser();
  }

  @then(/the user receives status code of ([0-9]+)/)
  public statusResponse(status: number) {
    assert.equal(this.context.response.status, status);
  }

  @then(/the total amount is equals to ([0-9]+)/)
  public totalAmountEqualsTo(amount: number) {
    assert.equal(this.context.response.body.amount, amount);
  }

  @then(/the total amount is greater than ([0-9]+)/)
  public totalAmountGreaterThan(amount: number) {
    assert.isAtLeast(this.context.response.body.amount, +amount);
  }

  @then(/exists ([0-9]+) usages?/)
  public existsUsages(usages: number) {
    assert.equal(this.context.response.body.usages.length, usages);
  }

  private async updateStatusDispenser(
    updateStatusRequest: UpdateStatusDispenserDto,
    secondsAgo?: number,
  ) {
    if (secondsAgo != null) {
      const now = new Date();
      updateStatusRequest.updated_at = new Date(
        now.getTime() - secondsAgo * 1000,
      ).toLocaleString();
    }

    const dispenserId = this.context.response.body.id;
    return request(this.context.app.getHttpServer())
      .put(`/dispenser/${dispenserId}/status`)
      .send(updateStatusRequest);
  }

  private async createDispenser() {
    const createDispenserDto: CreateDispenserDto = {
      flow_volume: '0.00001',
    };

    return request(this.context.app.getHttpServer())
      .post('/dispenser')
      .send(createDispenserDto);
  }
}
