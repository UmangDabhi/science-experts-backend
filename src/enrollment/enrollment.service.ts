import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { User } from 'src/user/entities/user.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { Enrollment } from './entities/enrollment.entity';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) { }
  async create(currUser: User, createEnrollmentDto: CreateEnrollmentDto) {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id: createEnrollmentDto.course },
      });
      if (!existingCourse) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      const newEnrollment = await this.enrollmentRepository.save({
        course: existingCourse,
        student: { id: currUser.id },
      });
      return newEnrollment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_ENROLLMENT_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_ENROLLMENT);
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Enrollment>> {
    try {
      const result = await pagniateRecords(
        this.enrollmentRepository,
        paginationDto,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_ENROLLMENTS);
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} enrollment`;
  }

  async update(
    currUser: User,
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: id, student: { id: currUser.id } },
      });
      if (!enrollment)
        throw new NotFoundException(ERRORS.ERROR_ENROLLMENT_NOT_FOUND);

      const updateData: any = { ...updateEnrollmentDto };
      await this.enrollmentRepository.update(id, updateData);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_COURSE);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: id, student: { id: currUser.id } },
      });
      if (!enrollment) {
        throw new NotFoundException(ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
      }
      await this.enrollmentRepository.delete(enrollment.id);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // if (error.code == "23503") {
      //   throw new ConflictException(ERRORS.ERROR_ENROLLMENT_ALREADY_EXISTS);
      // }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_ENROLLMENT);
    }
  }
}
