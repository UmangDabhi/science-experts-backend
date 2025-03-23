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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_REVIEW)
  @ResponseMessage(MESSAGES.REVIEW_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user, createReviewDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(API_ENDPOINT.GET_ALL_REVIEW)
  @ResponseMessage(MESSAGES.ALL_REVIEW_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reviewsService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_REVIEW}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req.user, id, updateReviewDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${API_ENDPOINT.UPDATE_REVIEW}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  showAsTestimonial(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewsService.showAsTestimonial(req.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(`${API_ENDPOINT.DELETE_REVIEW}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewsService.remove(req.user, id);
  }
}
