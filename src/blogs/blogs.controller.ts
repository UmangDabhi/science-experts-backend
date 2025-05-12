import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { BlogFilterDto } from './dto/filter-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_BLOG)
  @ResponseMessage(MESSAGES.BLOG_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogsService.create(req.user, createBlogDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_BLOG)
  @ResponseMessage(MESSAGES.ALL_BLOG_FETCHED)
  findAll(@Req() req: RequestWithUser, @Query() blogFilterDto: BlogFilterDto) {
    return this.blogsService.findAll(req.user, blogFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.MANAGE_ALL_BLOG)
  @ResponseMessage(MESSAGES.ALL_BLOG_FETCHED)
  manageAllBlog(@Req() req: RequestWithUser, @Query() blogFilterDto: BlogFilterDto) {
    return this.blogsService.manageAllBlog(req.user, blogFilterDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${API_ENDPOINT.GET_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_FETCHED)
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.blogsService.findOne(req.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(req.user, id, updateBlogDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.blogsService.remove(req.user, id);
  }
}
