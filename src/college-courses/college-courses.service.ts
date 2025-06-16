import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCollegeCourseDto } from './dto/create-college-course.dto';
import { UpdateCollegeCourseDto } from './dto/update-college-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CollegeCourse } from './entities/college-course.entity';
import { Repository } from 'typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { FilterDto } from 'src/Helper/dto/filter.dto';

@Injectable()
export class CollegeCoursesService {
  constructor(
    @InjectRepository(CollegeCourse)
    private readonly collegeCourseRepository: Repository<CollegeCourse>,
  ) { }
  async create(createCollegeCourseDto: CreateCollegeCourseDto) {
    try {
      const newCollegeCourse = this.collegeCourseRepository.create({
        ...createCollegeCourseDto,
      });
      return await this.collegeCourseRepository.save(newCollegeCourse);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COLLEGE_COURSE);
    }
  }

  async findAll(filterDto: FilterDto) {
    try {
      const searchableFields: (keyof CollegeCourse)[] = ['name'];
      const queryOptions: any = {};

      const result = await pagniateRecords(
        this.collegeCourseRepository,
        filterDto,
        searchableFields,
        queryOptions,
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COLLEGE_COURSES);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const collegeCourse = await this.collegeCourseRepository.findOne({
        where: { id: id },

      });
      if (!collegeCourse) throw new NotFoundException(ERRORS.ERROR_COLLEGE_COURSE_NOT_FOUND);
      return collegeCourse
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COLLEGE_COURSE);
    }
  }

  async update(id: string, updateCollegeCourseDto: UpdateCollegeCourseDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const collegeCourse = await this.collegeCourseRepository.findOne({
        where: { id: id },
      });
      if (!collegeCourse) throw new NotFoundException(ERRORS.ERROR_COLLEGE_NOT_FOUND);

      Object.assign(collegeCourse, {
        ...updateCollegeCourseDto,
      });

      await this.collegeCourseRepository.save(collegeCourse);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_COLLEGE);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const collegeCourse = await this.collegeCourseRepository.findOne({
        where: { id: id },
      });
      if (!collegeCourse) {
        throw new NotFoundException(ERRORS.ERROR_COLLEGE_NOT_FOUND);
      }
      await this.collegeCourseRepository.delete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_COLLEGE);
    }
  }
}
