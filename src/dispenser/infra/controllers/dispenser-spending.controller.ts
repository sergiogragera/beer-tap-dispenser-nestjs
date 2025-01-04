import {
  Controller,
  Param,
  ParseUUIDPipe,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FindDispenserSpendingsUseCase } from '../../application/use-cases/find-dispenser-spendings.use-case';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { SpendingResponseDto } from './dto/response/spending-response.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SpendingResponseAdapter } from './adapters/spending-response.adapter';

@Controller('dispenser/:id/spending')
export class DispenserSpendingController {
  constructor(
    private readonly findDispenserSpendingsUseCase: FindDispenserSpendingsUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Returns the money spent by the given dispenser Id',
    description: `Whether the dispenser is open or close, this endpoint returns how much money has this dispenser ID spent break 
        down by its uses. This endpoint could be request at any time, even if the tap is open 
        (so, the closed_at field would be null).\n

To do so, we will use a reference value of 12.25€/l. 

So, if the dispenser has configured the flow volume ratio as 0.064 litres/second and the tap was open for 
22 seconds, the total spent for this usage is 17.248.`,
  })
  @ApiOkResponse({
    description: 'Total amount spent by the dispenser',
    type: SpendingResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Dispenser not found',
  })
  async findAll(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SpendingResponseDto> {
    try {
      const usages = await this.findDispenserSpendingsUseCase.execute(
        DispenserId.fromString(id),
      );
      return SpendingResponseAdapter.adapt(usages);
    } catch (error) {
      if (error instanceof DispenserNotFoundException) {
        throw new HttpException('Dispenser not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
