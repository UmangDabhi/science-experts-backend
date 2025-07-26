import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { CacheService } from 'src/Helper/services/cache.service';
import { CACHE_KEY } from 'src/Helper/message/cache.const';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly cacheService: CacheService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_BOOK)
  @ResponseMessage(MESSAGES.BOOK_CREATED)
  create(@Req() req: RequestWithUser, @Body() createBookDto: CreateBookDto) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.BOOKS,
      CACHE_KEY.MANAGE_BOOKS,
    ]);
    return this.booksService.create(req.user, createBookDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY.MANAGE_BOOKS)
  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.MANAGE_ALL_BOOK)
  @ResponseMessage(MESSAGES.ALL_BOOK_FETCHED)
  manageAllCourse(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.booksService.manageAllBook(req.user, filterDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY.BOOKS)
  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_BOOK)
  @ResponseMessage(MESSAGES.ALL_BOOK_FETCHED)
  findAll(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.booksService.findAll(req?.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_BOOK}/:id`)
  @ResponseMessage(MESSAGES.BOOK_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.booksService.findOne(req?.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_BOOK}/:id`)
  @ResponseMessage(MESSAGES.BOOK_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(req.user, id, updateBookDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_BOOK}/:id`)
  @ResponseMessage(MESSAGES.BOOK_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    this.cacheService.deleteMultiple([
      CACHE_KEY.DASHBOARD_DETAILS,
      CACHE_KEY.BOOKS,
      CACHE_KEY.MANAGE_BOOKS,
    ]);
    return this.booksService.remove(req.user, id);
  }
}
