import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_CATEGORY)
  @ResponseMessage(MESSAGES.CATEGORY_CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

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

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_CATEGORY}/:id`)
  @ResponseMessage(MESSAGES.CATEGORY_UPDATED)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_CATEGORY}/:id`)
  @ResponseMessage(MESSAGES.CATEGORY_DELETED)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
