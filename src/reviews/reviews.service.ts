import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) { }
  async create(currUser: User, createReviewDto: CreateReviewDto) {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id: createReviewDto.course },
      });
      if (!existingCourse) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      const existingModule = await this.moduleRepository.findOne({
        where: { id: createReviewDto.module },
      });
      if (!existingModule) {
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);
      }
      const newReview = await this.reviewRepository.save({
        course: existingCourse,
        module: existingModule,
        student: { id: currUser.id },
        review: createReviewDto.review,
      });
      return newReview;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_REVIEW);
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Review>> {
    try {
      const searchableFields: (keyof Review)[] = ['review'];

      const result = await pagniateRecords(
        this.reviewRepository,
        paginationDto,
        searchableFields,
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_REVIEWS);
    }
  }

  async findCourseReviews(
    courseId: string,
    currUser: User,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Review>> {
    try {
      if (!courseId) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });
      if (!course) throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);

      const searchableFields: (keyof Review)[] = ['review'];
      const queryOptions = { course: { id: courseId } };
      const relations = ['student'];
      const orderBy = { field: 'created_at' as keyof Review, direction: 'DESC' as const };

      const result = await pagniateRecords(
        this.reviewRepository,
        paginationDto,
        searchableFields,
        queryOptions,
        relations,
        orderBy,
      );

      if (currUser) {
        result.data = result.data.map(review => ({
          ...review,
          isMyReview: review.student?.id === currUser.id
        }));

        result.data.sort((a, b) => {
          if (a['isMyReview'] && !b['isMyReview']) return -1;
          if (!a['isMyReview'] && b['isMyReview']) return 1;
          return 0;
        });
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_REVIEWS);
    }
  }
  async findAllTestimonials(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Review>> {
    try {
      const searchableFields: (keyof Review)[] = ['review'];
      const queryOptions = { show_as_testimonials: true };
      const result = await pagniateRecords(
        this.reviewRepository,
        paginationDto,
        searchableFields,
        queryOptions
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_REVIEWS);
    }
  }

  async update(currUser: User, id: string, updateReviewDto: UpdateReviewDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      await this.reviewRepository.update(
        { id: id, student: { id: currUser.id } },
        { review: updateReviewDto.review, rating: updateReviewDto.rating },
      );
      return;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_REVIEW);
    }
  }

  async changeTestimonial(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    try {

      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      await this.reviewRepository.update(
        { id: id },
        { show_as_testimonials: updateTestimonialDto.show_as_testimonials },
      );
      return;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_REVIEW);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const review = await this.reviewRepository.findOne({
        where: { id: id, student: { id: currUser.id } },
      });
      if (!review) {
        throw new NotFoundException(ERRORS.ERROR_REVIEW_NOT_FOUND);
      }
      await this.reviewRepository.delete(review.id);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_REVIEW);
    }
  }
}
