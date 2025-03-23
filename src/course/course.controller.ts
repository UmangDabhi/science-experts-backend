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
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFilterDto } from './dto/filter-course.dto';
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_COURSE)
  @ResponseMessage(MESSAGES.COURSE_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(req.user, createCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_COURSE)
  @ResponseMessage(MESSAGES.ALL_COURSE_FETCHED)
  findAll(@Query() courseFilterDto: CourseFilterDto, @Query() data: any) {
    return this.courseService.findAll(courseFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(req.user, id, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.courseService.remove(req.user, id);
  }
}
