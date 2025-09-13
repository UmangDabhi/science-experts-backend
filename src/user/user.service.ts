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
      const user = await this.userRepository.findOne({ where: { id: id }, relations: ["enrollments", "enrollments.course",  "user_balance", 'referrals'] });

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
      return {
        ...user,
        user_balance: Object.values(groupedBalances),
        referrals: user.referrals.map((ref) => ({
          name: ref.name,
        })),
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.log(error)
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

      // Execute user-specific counts and static counts in parallel
      const [userCounts, staticCounts] = await Promise.all([
        this.getUserSpecificCounts(user.id),
        this.getStaticCounts()
      ]);

      return {
        courseCount: userCounts.courseCount,
        materialsCount: userCounts.materialsCount,
        booksCount: userCounts.booksCount,
        papersCount: userCounts.papersCount,
        blogsCount: userCounts.blogsCount,
        tutorCount: userCounts.tutorCount,
        categoryCount: staticCounts.categoryCount,
        standardCount: staticCounts.standardCount,
        collegeCount: staticCounts.collegeCount,
        languageCount: staticCounts.languageCount,
        collegeCourseCount: staticCounts.collegeCourseCount,
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

  private async getUserSpecificCounts(userId: string) {
    // Use optimized QueryBuilder for better performance and type safety
    const [courseCount, materialsCount, booksCount, papersCount, blogsCount, tutorCount] = await Promise.all([
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tutor_courses', 'course')
        .where('user.id = :userId', { userId })
        .select('COUNT(course.id)', 'count')
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tutor_materials', 'material')
        .where('user.id = :userId', { userId })
        .select('COUNT(material.id)', 'count')
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tutor_books', 'book')
        .where('user.id = :userId', { userId })
        .select('COUNT(book.id)', 'count')
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.tutor_papers', 'paper')
        .where('user.id = :userId', { userId })
        .select('COUNT(paper.id)', 'count')
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.blogs', 'blog')
        .where('user.id = :userId', { userId })
        .select('COUNT(blog.id)', 'count')
        .getRawOne(),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :userId AND user.role = :role', { userId, role: 'tutor' })
        .select('COUNT(user.id)', 'count')
        .getRawOne()
    ]);

    return {
      courseCount: Number(courseCount?.count || 0),
      materialsCount: Number(materialsCount?.count || 0),
      booksCount: Number(booksCount?.count || 0),
      papersCount: Number(papersCount?.count || 0),
      blogsCount: Number(blogsCount?.count || 0),
      tutorCount: Number(tutorCount?.count || 0),
    };
  }

  private async getStaticCounts() {  

    // Execute all static counts in parallel using repository methods
    const [categoryCount, standardCount, languageCount, collegeCount, collegeCourseCount] = await Promise.all([
      this.categoryRepository.count(),
      this.standardRepository.count(),
      this.languageRepository.count(),
      this.collegeRepository.count(),
      this.collegeCourseRepository.count()
    ]);

    const counts = {
      categoryCount: Number(categoryCount || 0),
      standardCount: Number(standardCount || 0),
      languageCount: Number(languageCount || 0),
      collegeCount: Number(collegeCount || 0),
      collegeCourseCount: Number(collegeCourseCount || 0),
    };

    return counts;
  }

  async markTutorialCompleted(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }

      await this.userRepository.update(id, { has_completed_tutorial: true });
      return { message: 'Tutorial marked as completed' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update tutorial status');
    }
  }

  async getTutorialStatus(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      const user = await this.userRepository.findOne({
        where: { id: id },
        select: ['id', 'has_completed_tutorial']
      });

      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }

      return {
        has_completed_tutorial: user.has_completed_tutorial || false
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get tutorial status');
    }
  }
}
