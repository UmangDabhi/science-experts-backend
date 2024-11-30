import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from '@nestjs/passport';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_COURSE)
  @ResponseMessage(MESSAGES.COURSE_CREATED)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_COURSE)
  @ResponseMessage(MESSAGES.ALL_COURSE_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.courseService.findAll(paginationDto);
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
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_DELETED)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
