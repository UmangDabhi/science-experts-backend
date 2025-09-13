import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_ENROLLMENT)
  @ResponseMessage(MESSAGES.ENROLLMENT_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentService.create(req.user, createEnrollmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_ENROLLMENT)
  @ResponseMessage(MESSAGES.ALL_ENROLLMENT_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.enrollmentService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`${API_ENDPOINT.GET_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_FETCHED)
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(req.user, id, updateEnrollmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.enrollmentService.remove(req.user, id);
  }
}
