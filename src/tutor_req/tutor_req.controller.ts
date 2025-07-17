import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TutorReqService } from './tutor_req.service';
import { CreateTutorReqDto } from './dto/create-tutor_req.dto';
import { UpdateTutorReqDto } from './dto/update-tutor_req.dto';

@Controller('tutor-req')
export class TutorReqController {
  constructor(private readonly tutorReqService: TutorReqService) {}

  @Post()
  create(@Body() createTutorReqDto: CreateTutorReqDto) {
    return this.tutorReqService.create(createTutorReqDto);
  }

  @Get()
  findAll() {
    return this.tutorReqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorReqService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorReqDto: UpdateTutorReqDto) {
    return this.tutorReqService.update(+id, updateTutorReqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorReqService.remove(+id);
  }
}
