import {
  Controller,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { UpdateStatusDispenserUseCase } from '../../application/use-cases/update-status-dispenser.use-case';
import { UpdateStatusDispenserDto } from './dto/request/update-status-dispenser.dto';
import { DispenserAlreadyOpenedException } from '../../domain/exceptions/dispenser-already-opened.exception';
import { DispenserAlreadyClosedException } from '../../domain/exceptions/dispenser-already-closed.exception';
import { DispenserClosedAfterOpenException } from '../../domain/exceptions/dispenser-closed-after-open.exception';
import { DispenserNotOpenedException } from '../../domain/exceptions/dispenser-not-opened.exception';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';

@Controller('dispenser/:id/status')
export class DispenserStatusController {
  constructor(
    private readonly updateStatusDispenserUseCase: UpdateStatusDispenserUseCase,
  ) {}

  @Put()
  @HttpCode(202)
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDispenserDto: UpdateStatusDispenserDto,
  ): Promise<DispenserPrimitives> {
    try {
      const updatedAt = new Date(updateDispenserDto.updated_at ?? Date.now());
      return await this.updateStatusDispenserUseCase.execute(
        DispenserId.fromString(id),
        updateDispenserDto.status,
        updatedAt,
      );
    } catch (error) {
      if (
        error instanceof DispenserAlreadyOpenedException ||
        error instanceof DispenserAlreadyClosedException ||
        error instanceof DispenserClosedAfterOpenException ||
        error instanceof DispenserNotOpenedException
      ) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      if (error instanceof DispenserNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
