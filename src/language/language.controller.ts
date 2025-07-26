import { CacheKey } from '@nestjs/cache-manager';
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
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_LANGUAGE)
  @ResponseMessage(MESSAGES.LANGUAGE_CREATED)
  create(@Body() createLanguageDto: CreateLanguageDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.LANGUAGES,
    ]);
    return this.languageService.create(createLanguageDto);
  }

  @UseInterceptors(GeneralCacheInterceptor(CACHE_KEY.LANGUAGES))
  @CacheKey(CACHE_KEY.LANGUAGES)
  @Get(API_ENDPOINT.GET_ALL_LANGUAGE)
  @ResponseMessage(MESSAGES.ALL_LANGUAGE_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.languageService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_LANGUAGE}/:id`)
  @ResponseMessage(MESSAGES.LANGUAGE_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_LANGUAGE}/:id`)
  @ResponseMessage(MESSAGES.LANGUAGE_DELETED)
  remove(@Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.LANGUAGES,
    ]);
    return this.languageService.remove(id);
  }
}
