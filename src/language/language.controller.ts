import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { ResponseMessage } from 'src/Helper/constants';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_LANGUAGE)
  @ResponseMessage(MESSAGES.LANGUAGE_CREATED)
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_LANGUAGE)
  @ResponseMessage(MESSAGES.ALL_LANGUAGE_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.languageService.findAll(paginationDto);
  }



  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_LANGUAGE}/:id`)
  @ResponseMessage(MESSAGES.LANGUAGE_UPDATED)

  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_LANGUAGE}/:id`)
  @ResponseMessage(MESSAGES.LANGUAGE_DELETED)
  remove(@Param('id') id: string) {
    return this.languageService.remove(id);
  }
}
