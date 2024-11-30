import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { join } from 'path';
import { localStoragePath } from 'src/Helper/constants';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) { }
  async create(createCourseDto: CreateCourseDto): Promise<any> {
    try {
      const newCourse = this.courseRepository.create({
        ...createCourseDto,
        tutor: { id: createCourseDto.tutor },
      });
      return await this.courseRepository.save(newCourse);

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COURSE);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Course>> {
    try {
      const searchableFields: (keyof Course)[] = ['title'];

      const result = await pagniateRecords(
        this.courseRepository,
        paginationDto,
        searchableFields
      );

      result.data.forEach((course) => {
        if (course.thumbnail_url) {
          course.thumbnail_url = `${process.env.BASE_MEDIA_URL}/${course.thumbnail_url}`;
        }
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }


  async findOne(id: string) {
    try {
      if (!id)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({ where: { id: id }, relations: ['modules', 'tutor'] });
      if (!course)
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);

      return course;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSE);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      if (!id)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const course = await this.courseRepository.findOne({ where: { id: id } });
      if (!course)
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);

      const updateData: any = { ...updateCourseDto };

      if (updateCourseDto.tutor)
        updateData.tutor = { id: updateCourseDto.tutor };
      else
        delete updateData.tutor;


      await this.courseRepository.update(id, updateData);
      return;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof NotFoundException)
        throw error;

      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_COURSE);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const course = await this.courseRepository.findOne({ where: { id } })
      if (!course) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      await this.courseRepository.softDelete(id);
      return;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_COURSE);
    }
  }
} 
