import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseFilterDto } from './dto/filter-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Role } from 'src/Helper/constants';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
  ) { }
  async create(currUser: User, createCourseDto: CreateCourseDto): Promise<any> {
    try {
      const categoryEntities = createCourseDto.categories
        ? await this.categoryRepository.findBy({
          id: In(createCourseDto.categories),
        })
        : [];

      const standardEntities = createCourseDto.standards
        ? await this.standardRepository.findBy({
          id: In(createCourseDto.standards),
        })
        : [];

      const newCourse = this.courseRepository.create({
        ...createCourseDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        standards: standardEntities,
      });
      return await this.courseRepository.save(newCourse);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COURSE);
    }
  }

  async findAll(
    currUser: User,
    courseFilterDto: CourseFilterDto,
  ): Promise<PaginatedResult<Course>> {
    try {
      const searchableFields: (keyof Course)[] = ['title'];
      const queryOptions: any = {};

      if (courseFilterDto?.category) {
        queryOptions.categories = { id: courseFilterDto.category };
      }
      if (courseFilterDto?.standard) {
        queryOptions.standards = { id: courseFilterDto.standard };
      }
      const relations = ["modules", "enrollments", "reviews"];
      const result = await pagniateRecords(
        this.courseRepository,
        courseFilterDto,
        searchableFields,
        queryOptions,
        relations
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }

  async findOne(currUser: User, id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({
        where: { id: id },
        relations: [
          'modules',
          'tutor',
          'materials',
          'categories',
          'standards',
          'modules.progress',
          'reviews',
          'reviews.student',
        ],
      });
      if (!course) throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);

      if (currUser.role == Role.STUDENT) {
        const isEnrolled = await this.courseRepository.findOne({
          where: { id: id, enrollments: { id: currUser.id } }
        })
        if (!isEnrolled) {
          return {
            ...course,
            modules: course.modules.map((ele) => {
              if (!ele.is_free_to_watch)
                return { ...ele, video_url: null };
              return { ...ele };
            }),
            materials: course.materials.map((ele) => {
              return { ...ele, material_url: null };
            }),
          };
        }
      }

      return course;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
        console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSE);
    }
  }

  async update(currUser: User, id: string, updateCourseDto: UpdateCourseDto) {
    try {
      console.log(updateCourseDto)
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!course) throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      const categoryEntities = updateCourseDto.categories
        ? await this.categoryRepository.findBy({
          id: In(updateCourseDto.categories),
        })
        : [];

      const standardEntities = updateCourseDto.standards
        ? await this.standardRepository.findBy({
          id: In(updateCourseDto.standards),
        })
        : [];
      Object.assign(course, {
        ...updateCourseDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        standards: standardEntities,
      });

      await this.courseRepository.save(course);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_COURSE);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const course = await this.courseRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!course) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      await this.courseRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_COURSE);
    }
  }
}
