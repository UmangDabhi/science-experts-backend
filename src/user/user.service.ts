import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import * as bcrypt from 'bcrypt';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { Role } from 'src/Helper/constants';
import { CounterService } from 'src/counter/counter.service';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly counterService: CounterService
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const stu_id = await this.counterService.getNextStudentId();

      const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword, stu_id: stu_id });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_USER_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_USER);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof User)[] = ['name', 'email',];
      // const queryOptions = { role: Role.ADMIN };
      const result = await pagniateRecords(
        this.userRepository,
        paginationDto,
        searchableFields,
        // queryOptions
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USERS);
    }
  }

  async findAllTutor(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof User)[] = ['name', 'email',];
      const queryOptions = { role: Role.TUTOR };
      const result = await pagniateRecords(
        this.userRepository,
        paginationDto,
        searchableFields,
        queryOptions
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_TUTORS);
    }
  }
  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USER);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      await this.userRepository.update(id, updateUserDto);
      return;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_USER);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      await this.userRepository.softDelete(user.id);
      return;
    } catch (error) {
      console.log(error)
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_USER);
    }
  }

  async findByEmail(email: string) {
    try {
      if (!email) {
        throw new BadRequestException(ERRORS.ERROR_EMAIL_NOT_FOUND);
      }
      const user = await this.userRepository.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USER_BY_EMAIL);
    }
  }
}
