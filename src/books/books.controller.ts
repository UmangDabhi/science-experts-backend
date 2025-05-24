import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
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

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_BOOK)
  @ResponseMessage(MESSAGES.BOOK_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(req.user, createBookDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.MANAGE_ALL_BOOK)
  @ResponseMessage(MESSAGES.ALL_BOOK_FETCHED)
  manageAllCourse(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.booksService.manageAllBook(req.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_BOOK)
  @ResponseMessage(MESSAGES.ALL_BOOK_FETCHED)
  findAll(
    @Req() req: RequestWithUser,
    @Query() filterDto: FilterDto) {
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
    return this.booksService.remove(req.user, id);
  }
}
