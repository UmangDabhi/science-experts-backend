import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_ENROLLMENT)
  @ResponseMessage(MESSAGES.ENROLLMENT_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentService.create(req.user, createEnrollmentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_ENROLLMENT)
  @ResponseMessage(MESSAGES.ALL_ENROLLMENT_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.enrollmentService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_FETCHED)
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(req.user, id, updateEnrollmentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_ENROLLMENT}/:id`)
  @ResponseMessage(MESSAGES.ENROLLMENT_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.enrollmentService.remove(req.user, id);
  }
}
