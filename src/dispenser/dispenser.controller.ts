import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DispenserService } from './dispenser.service';
import { CreateDispenserDto } from './dto/create-dispenser.dto';
import { UpdateDispenserDto } from './dto/update-dispenser.dto';

@Controller('dispenser')
export class DispenserController {
  constructor(private readonly dispenserService: DispenserService) {}

  @Post()
  create(@Body() createDispenserDto: CreateDispenserDto) {
    return this.dispenserService.create(createDispenserDto);
  }

  @Get()
  findAll() {
    return this.dispenserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispenserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDispenserDto: UpdateDispenserDto,
  ) {
    return this.dispenserService.update(+id, updateDispenserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispenserService.remove(+id);
  }
}
