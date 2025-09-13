import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { CreateTutorReqDto } from './dto/create-tutor_req.dto';
import { UpdateTutorReqDto } from './dto/update-tutor_req.dto';
import { TutorReqService } from './tutor_req.service';

@Controller('tutor-req')
export class TutorReqController {
  constructor(private readonly tutorReqService: TutorReqService) {}

  @Post(API_ENDPOINT.CREATE_TUTOR_REQ)
  @ResponseMessage(MESSAGES.TUTOR_REQ_CREATED)
  create(@Body() createTutorReqDto: CreateTutorReqDto) {
    return this.tutorReqService.create(createTutorReqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_TUTOR_REQ)
  @ResponseMessage(MESSAGES.ALL_TUTOR_REQ_FETCHED)
  findAll(@Query() filterDto: FilterDto) {
    return this.tutorReqService.findAll(filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_TUTOR_REQ}/:id`)
  @ResponseMessage(MESSAGES.TUTOR_REQ_FETCHED)
  findOne(@Param('id') id: string) {
    return this.tutorReqService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_TUTOR_REQ}/:id`)
  @ResponseMessage(MESSAGES.TUTOR_REQ_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateTutorReqDto: UpdateTutorReqDto,
  ) {
    return this.tutorReqService.update(id, updateTutorReqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_TUTOR_REQ}/:id`)
  @ResponseMessage(MESSAGES.TUTOR_REQ_DELETED)
  remove(@Param('id') id: string) {
    return this.tutorReqService.remove(id);
  }
}
