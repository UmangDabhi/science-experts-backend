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
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Is_Approved, Role } from 'src/Helper/constants';
import { Language } from 'src/language/entities/language.entity';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { AttachCourseMaterialDto } from './dto/attach-course-material.dto';
import { Material } from 'src/material/entities/material.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}
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

      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: createCourseDto.language },
      });

      const newCourse = this.courseRepository.create({
        ...createCourseDto,
        tutor: { id: currUser.id },
        language: langaugeEntity,
        categories: categoryEntities,
        standards: standardEntities,
      });
      return await this.courseRepository.save(newCourse);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COURSE);
    }
  }
  async manageAllCourse(
    currUser: User,
    courseFilterDto: FilterDto,
  ): Promise<PaginatedResult<Course>> {
    try {
      const page = Number(courseFilterDto.page);
      const limit = Number(courseFilterDto.limit);

      const qb = this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.tutor', 'tutor')
        .leftJoin('course.categories', 'categories')
        .leftJoin('course.standards', 'standards')
        .loadRelationCountAndMap('course.modulesCount', 'course.modules')
        .loadRelationCountAndMap('course.reviewsCount', 'course.reviews')
        .loadRelationCountAndMap(
          'course.enrollmentsCount',
          'course.enrollments',
        );

      // Tutor restriction
      if (currUser.role === Role.TUTOR) {
        qb.andWhere('tutor.id = :tutorId', {
          tutorId: currUser.id,
        });
      }

      // Search
      const search = courseFilterDto?.search?.trim();
      if (search) {
        qb.andWhere('LOWER(course.title) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      // Category Filter
      if (courseFilterDto?.category) {
        qb.andWhere('categories.id = :categoryId', {
          categoryId: courseFilterDto.category,
        });
      }

      // Standard Filter
      if (courseFilterDto?.standard) {
        qb.andWhere('standards.id = :standardId', {
          standardId: courseFilterDto.standard,
        });
      }

      // Sorting
      switch (courseFilterDto?.sortby) {
        case 'Price:Low to High':
          qb.orderBy('course.price', 'ASC');
          break;

        case 'Price:High to Low':
          qb.orderBy('course.price', 'DESC');
          break;

        default:
          qb.orderBy('course.created_at', 'DESC');
      }

      // Optional Pagination
      if (page && limit) {
        qb.skip((page - 1) * limit).take(limit);
      }

      const [data, total] = await qb.getManyAndCount();
      await this.attachCourseDurationTotals(data);

      // Enrollment State
      if (currUser?.role === Role.STUDENT) {
        const enrolledCourses = await this.enrollmentRepository
          .createQueryBuilder('enrollment')
          .select('enrollment.course', 'courseId')
          .where('enrollment.student = :studentId', {
            studentId: currUser.id,
          })
          .getRawMany();

        const enrolledSet = new Set(enrolledCourses.map((e) => e.courseId));

        data.forEach((course) => {
          course['is_enrolled'] = enrolledSet.has(course.id);
        });
      } else if (currUser?.role === Role.TUTOR) {
        data.forEach((course) => {
          course['is_enrolled'] = course.tutor?.id === currUser.id;
        });
      } else if (currUser?.role === Role.ADMIN) {
        data.forEach((course) => {
          course['is_enrolled'] = true;
        });
      }

      return {
        data,
        total,
        ...(page && limit
          ? {
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            }
          : {}),
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }
  async findAll(
    currUser: User,
    courseFilterDto: FilterDto,
  ): Promise<PaginatedResult<Course>> {
    try {
      const page = Number(courseFilterDto.page);
      const limit = Number(courseFilterDto.limit);

      const qb = this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.tutor', 'tutor')
        .leftJoin('course.categories', 'categories')
        .leftJoin('course.standards', 'standards')
        .loadRelationCountAndMap('course.modulesCount', 'course.modules')
        .loadRelationCountAndMap('course.reviewsCount', 'course.reviews')
        .loadRelationCountAndMap(
          'course.enrollmentsCount',
          'course.enrollments',
        )
        .where('course.is_approved = :approved', {
          approved: Is_Approved.YES,
        });

      // Search
      const search = courseFilterDto?.search?.trim();
      if (search) {
        qb.andWhere('LOWER(course.title) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      // Category Filter
      if (courseFilterDto?.category) {
        qb.andWhere('categories.id = :categoryId', {
          categoryId: courseFilterDto.category,
        });
      }

      // Standard Filter
      if (courseFilterDto?.standard) {
        qb.andWhere('standards.id = :standardId', {
          standardId: courseFilterDto.standard,
        });
      }

      // Sorting
      switch (courseFilterDto?.sortby) {
        case 'Price:Low to High':
          qb.orderBy('course.price', 'ASC');
          break;

        case 'Price:High to Low':
          qb.orderBy('course.price', 'DESC');
          break;

        default:
          qb.orderBy('course.created_at', 'DESC');
      }

      // Pagination Optional Support
      if (page && limit) {
        qb.skip((page - 1) * limit).take(limit);
      }

      const [data, total] = await qb.getManyAndCount();
      await this.attachCourseDurationTotals(data);

      // Enrollment State
      if (currUser?.id) {
        if (currUser.role === Role.STUDENT) {
          const enrolledCourses = await this.enrollmentRepository
            .createQueryBuilder('enrollment')
            .select('enrollment.course', 'courseId')
            .where('enrollment.student = :studentId', {
              studentId: currUser.id,
            })
            .getRawMany();

          const enrolledSet = new Set(enrolledCourses.map((e) => e.courseId));

          data.forEach((course) => {
            course['is_enrolled'] = enrolledSet.has(course.id);
          });
        } else if (currUser.role === Role.TUTOR) {
          data.forEach((course) => {
            course['is_enrolled'] = course.tutor?.id === currUser.id;
          });
        } else if (currUser.role === Role.ADMIN) {
          data.forEach((course) => {
            course['is_enrolled'] = true;
          });
        }
      }

      return {
        data,
        total,
        ...(page && limit
          ? {
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            }
          : {}),
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }
  async findEnrolledCourse(
    currUser: User,
    courseFilterDto: FilterDto,
  ): Promise<PaginatedResult<Course>> {
    try {
      const searchableFields: (keyof Course)[] = ['title'];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };
      if (courseFilterDto?.category) {
        queryOptions.categories = { id: courseFilterDto.category };
      }
      if (courseFilterDto?.standard) {
        queryOptions.standards = { id: courseFilterDto.standard };
      }
      const sortOptions = {
        'Most Popular': { field: 'created_at', direction: 'DESC' },
        'Price:Low to High': { field: 'price', direction: 'ASC' },
        'Price:High to Low': { field: 'price', direction: 'DESC' },
      };

      const selectedSort = sortOptions[courseFilterDto?.sortby] || undefined;
      if (selectedSort) {
        orderBy.field = selectedSort.field || '';
        orderBy.direction = selectedSort.direction;
      }

      queryOptions.enrollments = { student: { id: currUser.id } };
      const relations = ['modules', 'enrollments', 'reviews', 'progress'];
      const result = await pagniateRecords(
        this.courseRepository,
        courseFilterDto,
        searchableFields,
        queryOptions,
        relations,
        orderBy,
      );

      return result;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }

  private async attachCourseDurationTotals(courses: Course[]) {
    if (!courses.length) return;

    const totals = await this.moduleRepository
      .createQueryBuilder('module')
      .select('module.course_id', 'courseId')
      .addSelect('COALESCE(SUM(module.duration), 0)', 'totalDuration')
      .where('module.course_id IN (:...courseIds)', {
        courseIds: courses.map((course) => course.id),
      })
      .groupBy('module.course_id')
      .getRawMany();

    const totalByCourse = new Map(
      totals.map((item) => [item.courseId, Number(item.totalDuration || 0)]),
    );

    courses.forEach((course) => {
      course['totalDuration'] = totalByCourse.get(course.id) || 0;
    });
  }

  async findOne(currUser: User, id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const qb = this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.tutor', 'tutor')
        .leftJoinAndSelect('course.materials', 'materials')
        .leftJoinAndSelect('course.categories', 'categories')
        .leftJoinAndSelect('course.standards', 'standards')
        .leftJoinAndSelect('course.language', 'language')
        .leftJoinAndSelect('course.modules', 'modules');

      if (currUser?.id) {
        qb.leftJoinAndSelect(
          'modules.progress',
          'progress',
          'progress.student_id = :studentId',
          { studentId: currUser.id },
        );
      }

      const course = await qb
        .where('course.id = :courseId', { courseId: id })
        .getOne();
      if (!course) throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      if (!currUser || currUser.role == Role.STUDENT) {
        const isEnrolled = currUser?.id
          ? await this.enrollmentRepository.findOne({
              where: {
                course: { id: id },
                student: { id: currUser.id },
              },
            })
          : null;

        if (!isEnrolled || !currUser) {
          return {
            ...course,
            modules: [...(course.modules || [])]
              .sort((a, b) => a?.order - b?.order)
              .map((ele) => ({
                ...ele,
                video_url:
                  ele.is_free_to_watch === true ||
                  String(ele.is_free_to_watch) === 'true'
                    ? ele.video_url
                    : null,
              })),

            materials: (course.materials || []).map((ele) => {
              return { ...ele, material_url: null };
            }),
          };
        }
        if (isEnrolled) {
          course['is_enrolled'] = true;
        }
      }
      if (
        currUser &&
        currUser.role == Role.TUTOR &&
        course.tutor?.id == currUser.id
      ) {
        course['is_enrolled'] = true;
      }
      if (currUser && currUser.role == Role.ADMIN) {
        course['is_enrolled'] = true;
      }
      return {
        ...course,
        modules: [...(course?.modules || [])].sort(
          (a, b) => a?.order - b?.order,
        ),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSE);
    }
  }

  async attachMaterial(
    currUser: User,
    attachCourseMaterialDto: AttachCourseMaterialDto,
  ) {
    try {
      if (!attachCourseMaterialDto.course)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({
        where: {
          id: attachCourseMaterialDto.course,
          tutor: { id: currUser.id },
        },
      });
      if (!course) throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);

      const materialEntites = attachCourseMaterialDto.material
        ? await this.materialRepository.findBy({
            id: In(attachCourseMaterialDto.material),
          })
        : [];

      await this.courseRepository.save({
        ...course,
        materials: materialEntites,
      });

      return {};
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSE);
    }
  }

  async update(currUser: User, id: string, updateCourseDto: UpdateCourseDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const whereCondition =
        currUser.role == Role.ADMIN
          ? { id: id }
          : { id: id, tutor: { id: currUser.id } };
      const course = await this.courseRepository.findOne({
        where: whereCondition,
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

      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: updateCourseDto.language },
      });

      Object.assign(course, {
        ...updateCourseDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        language: langaugeEntity,
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
      console.log(error);
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
