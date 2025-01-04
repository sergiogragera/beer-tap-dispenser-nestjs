import { DispenserPrimitives } from 'src/dispenser/domain/models/dispenser';
import { DispenserResponseDto } from '../dto/response/dispenser-response.dto';

export class DispenserResponseAdapter {
  static adapt(dispenser: DispenserPrimitives): DispenserResponseDto {
    return {
      id: dispenser.id,
      flow_volume: +dispenser.flowVolume,
    };
  }
}
