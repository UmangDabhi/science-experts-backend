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
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { CacheService } from 'src/Helper/services/cache.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  @Post(API_ENDPOINT.CREATE_USER)
  @ResponseMessage(MESSAGES.USER_CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.USERS,
      CACHE_KEY.TUTORS,
    ]);
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY.USERS)
  @Get(API_ENDPOINT.GET_ALL_USER)
  @ResponseMessage(MESSAGES.ALL_USER_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY.TUTORS)
  @Get(API_ENDPOINT.GET_ALL_TUTOR)
  @ResponseMessage(MESSAGES.ALL_TUTOR_FETCHED)
  findAllTutor(@Query() paginationDto: PaginationDto) {
    return this.userService.findAllTutor(paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_USER}/:id`)
  @ResponseMessage(MESSAGES.USER_FETCHED)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_USER}/:id`)
  @ResponseMessage(MESSAGES.USER_UPDATED)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_USER}/:id`)
  @ResponseMessage(MESSAGES.USER_DELETED)
  remove(@Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.USERS,
      CACHE_KEY.TUTORS,
    ]);
    return this.userService.remove(id);
  }

  @CacheKey(CACHE_KEY.DASHBOARD_DETAILS)
  @CacheTTL(0)
  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.DASHBOARD_DETAILS)
  @ResponseMessage(MESSAGES.DASHBOARD_DETAILS_FETCHED)
  dashboardDetails(@Req() req: RequestWithUser) {
    return this.userService.dashboardDetails(req.user);
  }
}
