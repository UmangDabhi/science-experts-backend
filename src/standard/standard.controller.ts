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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CacheService } from 'src/Helper/services/cache.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { StandardService } from './standard.service';

@Controller('standard')
export class StandardController {
  constructor(
    private readonly standardService: StandardService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_STANDARD)
  @ResponseMessage(MESSAGES.STANDARD_CREATED)
  create(@Body() createStandardDto: CreateStandardDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.STANDARDS,
    ]);
    return this.standardService.create(createStandardDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.STANDARDS))
  @Get(API_ENDPOINT.GET_ALL_STANDARD)
  @ResponseMessage(MESSAGES.ALL_STANDARD_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.standardService.findAll(paginationDto);
  }

  @Get(`${API_ENDPOINT.GET_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_FETCHED)
  findOne(@Param('id') id: string) {
    return this.standardService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateStandardDto: UpdateStandardDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.STANDARDS,
    ]);
    return this.standardService.update(id, updateStandardDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_STANDARD}/:id`)
  @ResponseMessage(MESSAGES.STANDARD_DELETED)
  remove(@Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.STANDARDS,
    ]);
    return this.standardService.remove(id);
  }
}
