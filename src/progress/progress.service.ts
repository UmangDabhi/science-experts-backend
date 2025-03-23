import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { User } from 'src/user/entities/user.entity';
import { Progress } from './entities/progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { ERRORS } from 'src/Helper/message/error.message';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}

  async create(currUser: User, createProgressDto: CreateProgressDto) {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id: createProgressDto.course },
      });
      if (!existingCourse) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      const existingModule = await this.moduleRepository.findOne({
        where: { id: createProgressDto.module },
      });
      if (!existingModule) {
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);
      }
      const newEnrollment = await this.progressRepository.save({
        course: existingCourse,
        module: existingModule,
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

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const progress = await this.progressRepository.findOne({
        where: { id: id, student: { id: currUser.id } },
      });
      if (!progress) {
        throw new NotFoundException(ERRORS.ERROR_PROGRESS_NOT_FOUND);
      }
      await this.progressRepository.delete(progress.id);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_PROGRESS);
    }
  }
}
