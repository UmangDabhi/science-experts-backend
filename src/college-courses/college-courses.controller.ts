import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CollegeCoursesService } from './college-courses.service';
import { CreateCollegeCourseDto } from './dto/create-college-course.dto';
import { UpdateCollegeCourseDto } from './dto/update-college-course.dto';

@Controller('college-courses')
export class CollegeCoursesController {
  constructor(private readonly collegeCoursesService: CollegeCoursesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_COLLEGE_COURSE)
  @ResponseMessage(MESSAGES.COLLEGE_COURSE_CREATED)
  create(@Body() createCollegeCourseDto: CreateCollegeCourseDto) {
    return this.collegeCoursesService.create(createCollegeCourseDto);
  }

  @ResponseMessage(MESSAGES.ALL_COLLEGE_COURSE_FETCHED)
  @Get(API_ENDPOINT.GET_ALL_COLLEGE_COURSE)
  findAll(@Query() filterDto: FilterDto) {
    return this.collegeCoursesService.findAll(filterDto);
  }

  @Get(`${API_ENDPOINT.GET_COLLEGE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_COURSE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.collegeCoursesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_COLLEGE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_COURSE_UPDATED)
  update(@Param('id') id: string, @Body() updateCollegeCourseDto: UpdateCollegeCourseDto) {
    return this.collegeCoursesService.update(id, updateCollegeCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_COLLEGE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_COURSE_DELETED)
  remove(@Param('id') id: string) {
    return this.collegeCoursesService.remove(id);
  }
}
