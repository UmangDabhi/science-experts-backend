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
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CacheService } from 'src/Helper/services/cache.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { CourseService } from './course.service';
import { AttachCourseMaterialDto } from './dto/attach-course-material.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_COURSE)
  @ResponseMessage(MESSAGES.COURSE_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.COURSES,
      CACHE_KEY.MANAGE_COURSES,
      CACHE_KEY.DASHBOARD_DETAILS,
    ]);
    return this.courseService.create(req.user, createCourseDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.MANAGE_COURSES))
  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.MANAGE_ALL_COURSE)
  @ResponseMessage(MESSAGES.ALL_COURSE_FETCHED)
  manageAllCourse(
    @Req() req: RequestWithUser,
    @Query() courseFilterDto: FilterDto,
  ) {
    return this.courseService.manageAllCourse(req.user, courseFilterDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.COURSES))
  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_COURSE)
  @ResponseMessage(MESSAGES.ALL_COURSE_FETCHED)
  findAll(@Req() req: RequestWithUser, @Query() courseFilterDto: FilterDto) {
    return this.courseService.findAll(req?.user, courseFilterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.GET_ENROLLED_COURSE)
  @ResponseMessage(MESSAGES.COURSE_FETCHED)
  findEnrolledCourse(
    @Req() req: RequestWithUser,
    @Query() courseFilterDto: FilterDto,
  ) {
    return this.courseService.findEnrolledCourse(req.user, courseFilterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.courseService.findOne(req?.user, id);
  }

  @UseGuards(OptionalAuthGuard)
  @Patch(`${API_ENDPOINT.ATTACH_COURSE_MATERIAL}/:id`)
  @ResponseMessage(MESSAGES.COURSE_MATERIAL_ATTACHED)
  attachMaterial(
    @Req() req: RequestWithUser,
    @Body() attachCourseMaterialDto: AttachCourseMaterialDto,
  ) {
    return this.courseService.attachMaterial(
      req?.user,
      attachCourseMaterialDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.MANAGE_COURSES,
      CACHE_KEY.COURSES,
      CACHE_KEY.DASHBOARD_DETAILS,
    ]);
    return this.courseService.update(req.user, id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_COURSE}/:id`)
  @ResponseMessage(MESSAGES.COURSE_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.COURSES,
      CACHE_KEY.MANAGE_COURSES,
      CACHE_KEY.DASHBOARD_DETAILS,
    ]);
    return this.courseService.remove(req.user, id);
  }
}
