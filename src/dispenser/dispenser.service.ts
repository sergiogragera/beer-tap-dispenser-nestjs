import { Injectable } from '@nestjs/common';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { UpdateDispenserDto } from './dto/update-dispenser.dto';

@Injectable()
export class DispenserService {
  create(createDispenserDto: CreateDispenserDto) {
    return 'This action adds a new dispenser';
  }

  findAll() {
    return `This action returns all dispenser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispenser`;
  }

  update(id: number, updateDispenserDto: UpdateDispenserDto) {
    return `This action updates a #${id} dispenser`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispenser`;
  }
}
