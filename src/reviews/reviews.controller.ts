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
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(API_ENDPOINT.CREATE_REVIEW)
  @ResponseMessage(MESSAGES.REVIEW_CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user, createReviewDto);
  }

  @Get(API_ENDPOINT.GET_ALL_REVIEW)
  @ResponseMessage(MESSAGES.ALL_REVIEW_FETCHED)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reviewsService.findAll(paginationDto);
  }

  @Get(API_ENDPOINT.GET_ALL_TESTIMONIALS)
  @ResponseMessage(MESSAGES.ALL_REVIEW_FETCHED)
  findAllTestimonials(@Query() paginationDto: PaginationDto) {
    return this.reviewsService.findAllTestimonials(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.UPDATE_REVIEW}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req.user, id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(`${API_ENDPOINT.CHANGE_TESTIMONIAL}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  changeTestimonial(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.reviewsService.changeTestimonial(id, updateTestimonialDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`${API_ENDPOINT.DELETE_REVIEW}/:id`)
  @ResponseMessage(MESSAGES.REVIEW_DELETED)
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewsService.remove(req.user, id);
  }
}
