import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { ResponseMessage } from 'src/Helper/constants';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_PAPER)
  @ResponseMessage(MESSAGES.PAPER_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createPaperDto: CreatePaperDto,
  ) {
    return this.papersService.create(req.user, createPaperDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.MANAGE_ALL_PAPER)
  @ResponseMessage(MESSAGES.ALL_PAPER_FETCHED)
  manageAllCourse(@Req() req: RequestWithUser, @Query() filterDto: FilterDto) {
    return this.papersService.manageAllPaper(req.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_PAPER)
  @ResponseMessage(MESSAGES.ALL_PAPER_FETCHED)
  findAll(
    @Req() req: RequestWithUser,
    @Query() filterDto: FilterDto) {
    return this.papersService.findAll(req?.user, filterDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(`${API_ENDPOINT.GET_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.papersService.findOne(req?.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
  ) {
    return this.papersService.update(req.user, id, updatePaperDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_PAPER}/:id`)
  @ResponseMessage(MESSAGES.PAPER_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.papersService.remove(req.user, id);
  }
}
