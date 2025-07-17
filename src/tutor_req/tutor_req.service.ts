import { Injectable } from '@nestjs/common';
import { CreateTutorReqDto } from './dto/create-tutor_req.dto';
import { UpdateTutorReqDto } from './dto/update-tutor_req.dto';

@Injectable()
export class TutorReqService {
  create(createTutorReqDto: CreateTutorReqDto) {
    return 'This action adds a new tutorReq';
  }

  findAll() {
    return `This action returns all tutorReq`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorReq`;
  }

  update(id: number, updateTutorReqDto: UpdateTutorReqDto) {
    return `This action updates a #${id} tutorReq`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutorReq`;
  }
}
