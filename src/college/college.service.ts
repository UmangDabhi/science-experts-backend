import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { ERRORS } from 'src/Helper/message/error.message';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';
import { CollegeCourse } from 'src/college-courses/entities/college-course.entity';
import { GetCollegeCoursesDto } from './dto/get-college-courses.dto';

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(CollegeCourse)
    private readonly collegeCourseRepository: Repository<CollegeCourse>,
  ) { }
  async create(currUser: User, createCollegeDto: CreateCollegeDto) {
    try {
      const courses = createCollegeDto.collegeCourses ? await this.collegeCourseRepository.findBy(
        { id: In(createCollegeDto.collegeCourses) }
      ) : [];
      const newCollege = this.collegeRepository.create({
        ...createCollegeDto,
        collegeCourses: courses,
        user: { id: currUser.id },
      });
      return await this.collegeRepository.save(newCollege);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COLLEGE);
    }
  }

  async findAllCollegeCourses(getCollegeCoursesDto: GetCollegeCoursesDto) {
    try {
      const courses = await this.collegeRepository.find({ where: { id: getCollegeCoursesDto.collegeCourse }, relations: ['collegeCourses'] });
      const result = courses.length > 0 ? courses.flatMap(college => college.collegeCourses) : [];
      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COLLEGES);
    }
  }
  async findAll(filterDto: FilterDto) {
    try {
      const searchableFields: (keyof College)[] = ['name', 'address'];
      const queryOptions: any = {};

      const result = await pagniateRecords(
        this.collegeRepository,
        filterDto,
        searchableFields,
        queryOptions,
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COLLEGES);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const college = await this.collegeRepository.findOne({
        where: { id: id },
        relations: ['collegeCourses'],

      });
      if (!college) throw new NotFoundException(ERRORS.ERROR_COLLEGE_NOT_FOUND);
      return college
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COLLEGE);
    }
  }

  async update(currUser: User, id: string, updateCollegeDto: UpdateCollegeDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const college = await this.collegeRepository.findOne({
        where: { id: id },
      });
      if (!college) throw new NotFoundException(ERRORS.ERROR_COLLEGE_NOT_FOUND);
      const courses = updateCollegeDto.collegeCourses ? await this.collegeCourseRepository.findBy(
        { id: In(updateCollegeDto.collegeCourses) }
      ) : [];

      Object.assign(college, {
        ...updateCollegeDto,
        collegeCourses: courses,
        user: { id: currUser.id },
      });

      await this.collegeRepository.save(college);
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

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const college = await this.collegeRepository.findOne({
        where: { id: id, user: { id: currUser.id } },
      });
      if (!college) {
        throw new NotFoundException(ERRORS.ERROR_COLLEGE_NOT_FOUND);
      }
      await this.collegeRepository.delete(id);
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
