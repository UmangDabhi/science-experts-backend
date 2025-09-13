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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogFilterDto } from './dto/filter-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_BLOG)
  @ResponseMessage(MESSAGES.BLOG_CREATED)
  create(@Req() req: RequestWithUser, @Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(req.user, createBlogDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(API_ENDPOINT.GET_ALL_BLOG)
  @ResponseMessage(MESSAGES.ALL_BLOG_FETCHED)
  findAll(@Query() blogFilterDto: BlogFilterDto) {
    return this.blogsService.findAll(blogFilterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ENDPOINT.MANAGE_ALL_BLOG)
  @ResponseMessage(MESSAGES.ALL_BLOG_FETCHED)
  manageAllBlog(
    @Req() req: RequestWithUser,
    @Query() blogFilterDto: BlogFilterDto,
  ) {
    return this.blogsService.manageAllBlog(req.user, blogFilterDto);
  }

  @Get(`${API_ENDPOINT.GET_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_FETCHED)
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_UPDATED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(req.user, id, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_BLOG}/:id`)
  @ResponseMessage(MESSAGES.BLOG_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.blogsService.remove(req.user, id);
  }
}
