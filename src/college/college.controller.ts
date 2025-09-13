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
import { ResponseMessage } from 'src/Helper/constants';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CacheService } from 'src/Helper/services/cache.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { GetCollegeCoursesDto } from './dto/get-college-courses.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Controller('college')
export class CollegeController {
  constructor(
    private readonly collegeService: CollegeService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_COLLEGE)
  @ResponseMessage(MESSAGES.COLLEGE_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createCollegeDto: CreateCollegeDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.COLLEGES,
    ]);
    return this.collegeService.create(req.user, createCollegeDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.COLLEGES))
  @ResponseMessage(MESSAGES.ALL_COLLEGE_FETCHED)
  @Get(API_ENDPOINT.GET_ALL_COLLEGE)
  findAll(@Query() filterDto: FilterDto) {
    return this.collegeService.findAll(filterDto);
  }

  @ResponseMessage(MESSAGES.ALL_COLLEGE_COURSE_FETCHED)
  @Get(API_ENDPOINT.GET_COLLEGE_SPECIFIC_COURSE)
  findAllCollegeCourses(@Query() getCollegeCoursesDto: GetCollegeCoursesDto) {
    return this.collegeService.findAllCollegeCourses(getCollegeCoursesDto);
  }

  @Get(`${API_ENDPOINT.GET_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_FETCHED)
  findOne(@Param('id') id: string) {
    return this.collegeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateCollegeDto: UpdateCollegeDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.COLLEGES,
    ]);
    return this.collegeService.update(req.user, id, updateCollegeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_COLLEGE}/:id`)
  @ResponseMessage(MESSAGES.COLLEGE_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.COLLEGES,
    ]);
    return this.collegeService.remove(req.user, id);
  }
}
