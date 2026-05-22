import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Book } from 'src/books/entities/book.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { Material } from 'src/material/entities/material.entity';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService implements OnModuleInit {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly dataSource: DataSource,
  ) { }

  private async ensureBlogReviewColumn() {
    await this.dataSource.query(`
      ALTER TABLE "review"
      ADD COLUMN IF NOT EXISTS "blog_id" uuid
    `);
    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "IDX_review_blog_id"
      ON "review" ("blog_id")
    `);
  }

  async onModuleInit() {
    await this.ensureBlogReviewColumn();
  }

  private async ensureEnrollment(currUser: User, courseId: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: currUser.id },
        course: { id: courseId },
      },
    });

    if (!enrollment) {
      throw new BadRequestException(ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
    }
  }

  async create(currUser: User, createReviewDto: CreateReviewDto) {
    try {
      const reviewTargets: Partial<Review> = {};
      const selectedTargetCount = [
        createReviewDto.course,
        createReviewDto.material,
        createReviewDto.book,
        createReviewDto.paper,
        createReviewDto.blog,
      ].filter(Boolean).length;

      if (!selectedTargetCount) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      if (selectedTargetCount > 1) {
        throw new BadRequestException(ERRORS.ERROR_CREATING_REVIEW);
      }

      if (createReviewDto.course) {
        const existingCourse = await this.courseRepository.findOne({
          where: { id: createReviewDto.course },
        });
        if (!existingCourse) {
          throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
        }

        await this.ensureEnrollment(currUser, existingCourse.id);
        reviewTargets.course = existingCourse;

        if (createReviewDto.module) {
          const existingModule = await this.moduleRepository.findOne({
            where: {
              id: createReviewDto.module,
              course: { id: existingCourse.id },
            },
          });
          if (!existingModule) {
            throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);
          }
          reviewTargets.module = existingModule;
        }
      }

      if (createReviewDto.material) {
        const material = await this.materialRepository.findOne({
          where: { id: createReviewDto.material },
        });
        if (!material) throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);
        reviewTargets.material = material;
      }

      if (createReviewDto.book) {
        const book = await this.bookRepository.findOne({
          where: { id: createReviewDto.book },
        });
        if (!book) throw new NotFoundException(ERRORS.ERROR_BOOK_NOT_FOUND);
        reviewTargets.book = book;
      }

      if (createReviewDto.paper) {
        const paper = await this.paperRepository.findOne({
          where: { id: createReviewDto.paper },
        });
        if (!paper) throw new NotFoundException(ERRORS.ERROR_PAPER_NOT_FOUND);
        reviewTargets.paper = paper;
      }

      if (createReviewDto.blog) {
        await this.ensureBlogReviewColumn();
        const blog = await this.blogRepository.findOne({
          where: { id: createReviewDto.blog },
        });
        if (!blog) throw new NotFoundException(ERRORS.ERROR_BLOG_NOT_FOUND);
        reviewTargets.blog = blog;
      }

      const newReview = await this.reviewRepository.save({
        ...reviewTargets,
        student: { id: currUser.id },
        review: createReviewDto.review,
        rating: createReviewDto.rating,
      });
      return newReview;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
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

      if (currUser?.id) {
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

  async findEntityReviews(
    entityType: string,
    entityId: string,
    currUser: User,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Review>> {
    try {
      if (!entityId) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const targetMap = {
        course: {
          repository: this.courseRepository,
          error: ERRORS.ERROR_COURSE_NOT_FOUND,
          where: { course: { id: entityId } },
        },
        module: {
          repository: this.moduleRepository,
          error: ERRORS.ERROR_MODULE_NOT_FOUND,
          where: { module: { id: entityId } },
        },
        material: {
          repository: this.materialRepository,
          error: ERRORS.ERROR_MATERIAL_NOT_FOUND,
          where: { material: { id: entityId } },
        },
        book: {
          repository: this.bookRepository,
          error: ERRORS.ERROR_BOOK_NOT_FOUND,
          where: { book: { id: entityId } },
        },
        paper: {
          repository: this.paperRepository,
          error: ERRORS.ERROR_PAPER_NOT_FOUND,
          where: { paper: { id: entityId } },
        },
        blog: {
          repository: this.blogRepository,
          error: ERRORS.ERROR_BLOG_NOT_FOUND,
          where: { blog: { id: entityId } },
        },
      };

      const target = targetMap[entityType as keyof typeof targetMap];
      if (!target) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      if (entityType === 'blog') {
        await this.ensureBlogReviewColumn();
      }

      const entity = await (target.repository as Repository<any>).findOne({ where: { id: entityId } });
      if (!entity) throw new NotFoundException(target.error);

      const result = await pagniateRecords(
        this.reviewRepository,
        paginationDto,
        ['review'],
        target.where as FindOptionsWhere<Review>,
        ['student'],
        { field: 'created_at' as keyof Review, direction: 'DESC' as const },
      );

      if (currUser?.id) {
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
