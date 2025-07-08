import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import * as bcrypt from 'bcrypt';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { BALANCE_TYPE, Role } from 'src/Helper/constants';
import { CounterService } from 'src/counter/counter.service';
import { UserBalanceService } from './user_balance.service';
import { Standard } from 'src/standard/entities/standard.entity';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { College } from 'src/college/entities/college.entity';
import { CollegeCourse } from 'src/college-courses/entities/college-course.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(CollegeCourse)
    private readonly collegeCourseRepository: Repository<CollegeCourse>,
    private readonly counterService: CounterService,
    private readonly userBalanceService: UserBalanceService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({ where: { referral_code: createUserDto.referral_code } });
      if (createUserDto.has_referral) {
        if (!userExists)
          throw new BadRequestException(ERRORS.ERROR_INVALID_REFERRAL_CODE);
        else {
          await this.userBalanceService.addCoins(userExists, BALANCE_TYPE.REFERRER_SIGNUP_BONUS)
          await this.userRepository.update({ id: userExists.id }, { referral_count: userExists.referral_count + 1 })
        }
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const stu_id = await this.counterService.getNextStudentId();
      let referral_code: string;
      let isUnique = false;

      while (!isUnique) {
        referral_code = this.generateAlphanumericCode();
        const userExists = await this.userRepository.findOne({ where: { referral_code } });
        if (!userExists) {
          isUnique = true;
        }
      }
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        stu_id: stu_id,
        referral_code: referral_code,
      });
      if (userExists && createUserDto.referral_code) {
        newUser.referred_by = userExists;
      }
      await this.userRepository.save(newUser);
      await this.userBalanceService.addCoins(newUser, BALANCE_TYPE.WELCOME_BONUS)
      if (userExists && createUserDto.referral_code) {
        await this.userBalanceService.addCoins(newUser, BALANCE_TYPE.REFEREE_SIGNUP_BONUS)
      }
      return newUser
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_USER_ALREADY_EXISTS);
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_USER);
    }
  }

  private generateAlphanumericCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof User)[] = ['name', 'email'];
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
      const searchableFields: (keyof User)[] = ['name', 'email'];
      const queryOptions = { role: Role.TUTOR };
      const result = await pagniateRecords(
        this.userRepository,
        paginationDto,
        searchableFields,
        queryOptions,
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
      const user = await this.userRepository.findOne({ where: { id: id }, relations: ["enrollments", "enrollments.course", "certificates", "user_balance"] });

      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      const groupedBalances = {};

      user.user_balance.forEach((balance) => {
        const type = balance.type;

        if (!groupedBalances[type]) {
          groupedBalances[type] = {
            type,
            total: 0,
            withdrawable: balance.balance_type.withdrawable,
          };
        }

        groupedBalances[type].total += balance.expert_coins;
      });
      user.user_balance = Object.values(groupedBalances);
      return user;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
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
      Object.assign(user, updateUserDto);
      await this.userRepository.save(user);
      // await this.userRepository.update(id, updateUserDto);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
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
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
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
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERRORS.ERROR_FETCHING_USER_BY_EMAIL,
      );
    }
  }

  async dashboardDetails(user: User) {
    try {
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }
      const counts = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tutor_courses', 'course')
        .leftJoin('user.tutor_materials', 'material')
        .leftJoin('user.tutor_books', 'book')
        .leftJoin('user.tutor_papers', 'paper')
        .leftJoin('user.blogs', 'blogs')
        .where('user.id = :id', { id: user.id })
        .select('user.id', 'userId')
        .addSelect('COUNT(DISTINCT course.id)', 'courseCount')
        .addSelect('COUNT(DISTINCT material.id)', 'materialsCount')
        .addSelect('COUNT(DISTINCT book.id)', 'booksCount')
        .addSelect('COUNT(DISTINCT paper.id)', 'papersCount')
        .addSelect('COUNT(DISTINCT blogs.id)', 'blogsCount')
        .addSelect(`SUM(CASE WHEN user.role = 'tutor' THEN 1 ELSE 0 END)`, 'tutorCount')
        .groupBy('user.id')
        .getRawOne();
      const categoryCount = await this.categoryRepository.count();
      const standardCount = await this.standardRepository.count();
      const languageCount = await this.languageRepository.count();
      const collegeCount = await this.collegeRepository.count();
      const collegeCourseCount = await this.collegeCourseRepository.count();

      return {
        courseCount: Number(counts.courseCount),
        materialsCount: Number(counts.materialsCount),
        booksCount: Number(counts.booksCount),
        papersCount: Number(counts.papersCount),
        blogsCount: Number(counts.blogsCount),
        tutorCount: Number(counts.tutorCount),
        categoryCount: Number(categoryCount),
        standardCount: Number(standardCount),
        collegeCount: Number(collegeCount),
        languageCount: Number(languageCount),
        collegeCourseCount: Number(collegeCourseCount),
      };

    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERRORS.ERROR_FETCHING_DASHBOARD_DETAILS,
      );
    }
  }
}
