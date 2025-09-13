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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CacheService } from 'src/Helper/services/cache.service';
import { GeneralCacheInterceptor } from 'src/interceptors/general-cache.interceptor';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_CATEGORY)
  @ResponseMessage(MESSAGES.CATEGORY_CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.CATEGORIES,
    ]);
    return this.categoryService.create(createCategoryDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.CATEGORIES))
  @Get(API_ENDPOINT.GET_ALL_CATEGORY)
  @ResponseMessage(MESSAGES.ALL_CATEGORY_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(`${API_ENDPOINT.GET_CATEGORY}/:id`)
  @ResponseMessage(MESSAGES.CATEGORY_FETCHED)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_CATEGORY}/:id`)
  @ResponseMessage(MESSAGES.CATEGORY_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.CATEGORIES,
    ]);
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_CATEGORY}/:id`)
  @ResponseMessage(MESSAGES.CATEGORY_DELETED)
  remove(@Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.CATEGORIES,
    ]);
    return this.categoryService.remove(id);
  }
}
