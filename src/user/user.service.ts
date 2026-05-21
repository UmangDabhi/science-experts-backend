import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  ForbiddenException,
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
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { BookPurchase } from 'src/books/entities/book_purchase.entity';
import { PaperPurchase } from 'src/papers/entities/paper_purchase.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/material/entities/material.entity';
import { Book } from 'src/books/entities/book.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { TutorReq } from 'src/tutor_req/entities/tutor_req.entity';
import { Admission } from 'src/admission/entities/admission.entity';
import { AdminListQueryDto } from './dto/admin-list-query.dto';

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
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(MaterialPurchase)
    private readonly materialPurchaseRepository: Repository<MaterialPurchase>,
    @InjectRepository(BookPurchase)
    private readonly bookPurchaseRepository: Repository<BookPurchase>,
    @InjectRepository(PaperPurchase)
    private readonly paperPurchaseRepository: Repository<PaperPurchase>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(TutorReq)
    private readonly tutorReqRepository: Repository<TutorReq>,
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
    private readonly counterService: CounterService,
    private readonly userBalanceService: UserBalanceService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { referral_code: createUserDto.referral_code },
      });
      if (createUserDto.has_referral) {
        if (!userExists)
          throw new BadRequestException(ERRORS.ERROR_INVALID_REFERRAL_CODE);
        else {
          await this.userBalanceService.addCoins(
            userExists,
            BALANCE_TYPE.REFERRER_SIGNUP_BONUS,
          );
          await this.userRepository.update(
            { id: userExists.id },
            { referral_count: userExists.referral_count + 1 },
          );
        }
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const stu_id = await this.counterService.getNextStudentId();
      let referral_code: string;
      let isUnique = false;

      while (!isUnique) {
        referral_code = this.generateAlphanumericCode();
        const userExists = await this.userRepository.findOne({
          where: { referral_code },
        });
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
      await this.userBalanceService.addCoins(
        newUser,
        BALANCE_TYPE.WELCOME_BONUS,
      );
      if (userExists && createUserDto.referral_code) {
        await this.userBalanceService.addCoins(
          newUser,
          BALANCE_TYPE.REFEREE_SIGNUP_BONUS,
        );
      }
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_USER_ALREADY_EXISTS);
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_USER);
    }
  }

  private generateAlphanumericCode(length = 8): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
      const user = await this.userRepository.findOne({
        where: { id: id },
        relations: [
          'enrollments',
          'enrollments.course',
          'user_balance',
          'referrals',
          'material_purchases',
          'material_purchases.material',
          'book_purchases',
          'book_purchases.book',
          'paper_purchases',
          'paper_purchases.paper',
        ],
      });

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

      const enrolledCoursesCount = user.enrollments?.length || 0;
      const purchasedMaterialsCount = user.material_purchases?.length || 0;
      const purchasedBooksCount = user.book_purchases?.length || 0;
      const purchasedPapersCount = user.paper_purchases?.length || 0;

      return {
        ...user,
        user_balance: Object.values(groupedBalances),
        referrals: user.referrals.map((ref) => ({
          name: ref.name,
        })),
        enrolledCourses: enrolledCoursesCount,
        purchasedMaterials: purchasedMaterialsCount,
        purchasedNotes: purchasedBooksCount,
        purchasedPapers: purchasedPapersCount,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.log(error);
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

  async updatePassword(id: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.update(id, {
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_USER);
    }
  }

  async dashboardDetails(user: User) {
    try {
      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }

      const [activityCounts, staticCounts] = await Promise.all([
        this.getActivityCounts(),
        this.getStaticCounts(),
      ]);

      return {
        courseCount: activityCounts.courseCount,
        materialsCount: activityCounts.materialsCount,
        booksCount: activityCounts.booksCount,
        papersCount: activityCounts.papersCount,
        blogsCount: activityCounts.blogsCount,
        studentCount: activityCounts.studentCount,
        tutorCount: activityCounts.tutorCount,
        incompleteProfileCount: activityCounts.incompleteProfileCount,
        referralCount: activityCounts.referralCount,
        enrollmentCount: activityCounts.enrollmentCount,
        materialPurchaseCount: activityCounts.materialPurchaseCount,
        bookPurchaseCount: activityCounts.bookPurchaseCount,
        paperPurchaseCount: activityCounts.paperPurchaseCount,
        purchaseCount: activityCounts.purchaseCount,
        certificateIssuedCount: activityCounts.certificateIssuedCount,
        tutorReqCount: activityCounts.tutorReqCount,
        admissionCount: activityCounts.admissionCount,
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

  private async getActivityCounts() {
    const [
      courseCount,
      materialsCount,
      booksCount,
      papersCount,
      blogsCount,
      studentCount,
      tutorCount,
      incompleteProfileCount,
      referralCount,
      enrollmentCount,
      materialPurchaseCount,
      bookPurchaseCount,
      paperPurchaseCount,
      certificateIssuedCount,
      tutorReqCount,
      admissionCount,
    ] = await Promise.all([
      this.courseRepository.count(),
      this.materialRepository.count(),
      this.bookRepository.count(),
      this.paperRepository.count(),
      this.blogRepository.count(),
      this.userRepository.count({ where: { role: Role.STUDENT } }),
      this.userRepository.count({ where: { role: Role.TUTOR } }),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: Role.STUDENT })
        .andWhere(
          `(user.phone_no IS NULL OR user.phone_no = '' OR user.standard IS NULL OR user.standard = '' OR user.school IS NULL OR user.school = '' OR user.city IS NULL OR user.city = '' OR user.state IS NULL OR user.state = '')`,
        )
        .getCount(),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.referred_by_id IS NOT NULL')
        .getCount(),
      this.enrollmentRepository.count(),
      this.materialPurchaseRepository.count(),
      this.bookPurchaseRepository.count(),
      this.paperPurchaseRepository.count(),
      this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .where('enrollment.certificate_url IS NOT NULL')
        .andWhere("enrollment.certificate_url != ''")
        .getCount(),
      this.tutorReqRepository.count(),
      this.admissionRepository.count(),
    ]);

    return {
      courseCount,
      materialsCount,
      booksCount,
      papersCount,
      blogsCount,
      studentCount,
      tutorCount,
      incompleteProfileCount,
      referralCount,
      enrollmentCount,
      materialPurchaseCount,
      bookPurchaseCount,
      paperPurchaseCount,
      purchaseCount: materialPurchaseCount + bookPurchaseCount + paperPurchaseCount,
      certificateIssuedCount,
      tutorReqCount,
      admissionCount,
    };
  }

  private async getStaticCounts() {
    // Execute all static counts in parallel using repository methods
    const [
      categoryCount,
      standardCount,
      languageCount,
      collegeCount,
      collegeCourseCount,
    ] = await Promise.all([
      this.categoryRepository.count(),
      this.standardRepository.count(),
      this.languageRepository.count(),
      this.collegeRepository.count(),
      this.collegeCourseRepository.count(),
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

  async adminStudents(query: AdminListQueryDto) {
    try {
      const qb = this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: Role.STUDENT })
        .select([
          'user.id',
          'user.stu_id',
          'user.name',
          'user.email',
          'user.phone_no',
          'user.standard',
          'user.school',
          'user.city',
          'user.state',
          'user.referral_code',
          'user.referral_count',
          'user.has_completed_tutorial',
          'user.created_at',
        ]);

      if (query.profileStatus === 'incomplete') {
        qb.andWhere(
          `(user.phone_no IS NULL OR user.phone_no = '' OR user.standard IS NULL OR user.standard = '' OR user.school IS NULL OR user.school = '' OR user.city IS NULL OR user.city = '' OR user.state IS NULL OR user.state = '')`,
        );
      }

      if (query.search) {
        qb.andWhere(
          `(user.name ILIKE :search OR user.email ILIKE :search OR user.stu_id ILIKE :search OR user.phone_no ILIKE :search)`,
          { search: `%${query.search}%` },
        );
      }

      qb.orderBy('user.created_at', 'DESC');
      return this.paginateQuery(qb, query);
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USERS);
    }
  }

  async adminReferrals(query: AdminListQueryDto) {
    try {
      const topReferrers = query.sortBy === 'topReferrers';
      const qb = this.userRepository.createQueryBuilder('user');

      if (topReferrers) {
        qb.where('user.referral_count > 0')
          .select([
            'user.id',
            'user.stu_id',
            'user.name',
            'user.email',
            'user.referral_code',
            'user.referral_count',
            'user.created_at',
          ])
          .orderBy('user.referral_count', 'DESC');
      } else {
        qb.leftJoinAndSelect('user.referred_by', 'referrer')
          .where('user.referred_by_id IS NOT NULL')
          .select([
            'user.id',
            'user.stu_id',
            'user.name',
            'user.email',
            'user.referral_code',
            'user.created_at',
            'referrer.id',
            'referrer.stu_id',
            'referrer.name',
            'referrer.email',
            'referrer.referral_code',
          ])
          .orderBy('user.created_at', 'DESC');
      }

      if (query.search) {
        qb.andWhere(
          `(user.name ILIKE :search OR user.email ILIKE :search OR user.stu_id ILIKE :search OR user.referral_code ILIKE :search)`,
          { search: `%${query.search}%` },
        );
      }

      return this.paginateQuery(qb, query);
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USERS);
    }
  }

  async adminEnrollments(query: AdminListQueryDto) {
    try {
      const qb = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('enrollment.course', 'course')
        .select([
          'enrollment.id',
          'enrollment.certificate_url',
          'enrollment.feedback',
          'enrollment.enrolled_at',
          'enrollment.completed_at',
          'student.id',
          'student.stu_id',
          'student.name',
          'student.email',
          'course.id',
          'course.title',
          'course.is_paid',
          'course.price',
        ])
        .orderBy('enrollment.enrolled_at', 'DESC');

      if (query.search) {
        qb.andWhere(
          `(student.name ILIKE :search OR student.email ILIKE :search OR student.stu_id ILIKE :search OR course.title ILIKE :search)`,
          { search: `%${query.search}%` },
        );
      }

      return this.paginateQuery(qb, query);
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_ENROLLMENTS);
    }
  }

  async adminPurchases(query: AdminListQueryDto) {
    try {
      const type = query.type || 'all';
      const purchases = [
        ...(type === 'all' || type === 'material'
          ? await this.getMaterialPurchases(query)
          : []),
        ...(type === 'all' || type === 'book' ? await this.getBookPurchases(query) : []),
        ...(type === 'all' || type === 'paper' ? await this.getPaperPurchases(query) : []),
      ].sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());

      const total = purchases.length;
      const page = Number(query.page || 1);
      const limit = Number(query.limit || total || 10);
      const start = query.page && query.limit ? (page - 1) * limit : 0;
      const data = query.page && query.limit ? purchases.slice(start, start + limit) : purchases;

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_USERS);
    }
  }

  async adminCertificates(query: AdminListQueryDto) {
    try {
      const qb = this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('enrollment.course', 'course')
        .where('enrollment.certificate_url IS NOT NULL')
        .andWhere("enrollment.certificate_url != ''")
        .select([
          'enrollment.id',
          'enrollment.certificate_url',
          'enrollment.enrolled_at',
          'enrollment.completed_at',
          'student.id',
          'student.stu_id',
          'student.name',
          'student.email',
          'course.id',
          'course.title',
        ])
        .orderBy('enrollment.completed_at', 'DESC');

      if (query.search) {
        qb.andWhere(
          `(student.name ILIKE :search OR student.email ILIKE :search OR student.stu_id ILIKE :search OR course.title ILIKE :search)`,
          { search: `%${query.search}%` },
        );
      }

      return this.paginateQuery(qb, query);
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_ENROLLMENTS);
    }
  }

  async getCertificateUrl(currUser: User, enrollmentId: string) {
    try {
      if (!enrollmentId) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: enrollmentId },
        relations: ['student', 'course', 'course.tutor'],
      });

      if (!enrollment) {
        throw new NotFoundException(ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
      }

      if (!enrollment.certificate_url) {
        throw new NotFoundException('Certificate not generated yet');
      }

      const isAdmin = currUser?.role === Role.ADMIN;
      const isOwner = enrollment.student?.id === currUser?.id;
      const isCourseTutor = enrollment.course?.tutor?.id === currUser?.id;

      if (!isAdmin && !isOwner && !isCourseTutor) {
        throw new ForbiddenException('You are not allowed to access this certificate');
      }

      return {
        enrollment_id: enrollment.id,
        certificate_url: enrollment.certificate_url,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching certificate');
    }
  }

  private async getMaterialPurchases(query: AdminListQueryDto) {
    const purchases = await this.materialPurchaseRepository.find({
      relations: ['student', 'material'],
      order: { enrolled_at: 'DESC' },
    });
    return purchases
      .filter((purchase) => this.matchesPurchaseSearch(purchase.student, purchase.material, query.search))
      .map((purchase) => ({
        id: `material-${purchase.id}`,
        purchase_id: purchase.id,
        type: 'Note',
        student: this.safeUser(purchase.student),
        item: {
          id: purchase.material?.id,
          title: purchase.material?.title,
          amount: purchase.material?.amount,
        },
        feedback: purchase.feedback,
        purchased_at: purchase.enrolled_at,
        completed_at: purchase.completed_at,
      }));
  }

  private async getBookPurchases(query: AdminListQueryDto) {
    const purchases = await this.bookPurchaseRepository.find({
      relations: ['student', 'book'],
      order: { purchased_at: 'DESC' },
    });
    return purchases
      .filter((purchase) => this.matchesPurchaseSearch(purchase.student, purchase.book, query.search))
      .map((purchase) => ({
        id: `book-${purchase.id}`,
        purchase_id: purchase.id,
        type: 'Book',
        student: this.safeUser(purchase.student),
        item: {
          id: purchase.book?.id,
          title: purchase.book?.title,
          amount: purchase.book?.amount,
        },
        feedback: purchase.feedback,
        purchased_at: purchase.purchased_at,
      }));
  }

  private async getPaperPurchases(query: AdminListQueryDto) {
    const purchases = await this.paperPurchaseRepository.find({
      relations: ['student', 'paper'],
      order: { purchased_at: 'DESC' },
    });
    return purchases
      .filter((purchase) => this.matchesPurchaseSearch(purchase.student, purchase.paper, query.search))
      .map((purchase) => ({
        id: `paper-${purchase.id}`,
        purchase_id: purchase.id,
        type: 'Paper',
        student: this.safeUser(purchase.student),
        item: {
          id: purchase.paper?.id,
          title: purchase.paper?.title,
          amount: purchase.paper?.amount,
        },
        feedback: purchase.feedback,
        purchased_at: purchase.purchased_at,
      }));
  }

  private matchesPurchaseSearch(student: User, item: any, search?: string) {
    if (!search) return true;
    const value = search.toLowerCase();
    return [student?.name, student?.email, student?.stu_id, item?.title]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(value));
  }

  private safeUser(user: User) {
    if (!user) return null;
    return {
      id: user.id,
      stu_id: user.stu_id,
      name: user.name,
      email: user.email,
      phone_no: user.phone_no,
      standard: user.standard,
      school: user.school,
      city: user.city,
      state: user.state,
      referral_code: user.referral_code,
      referral_count: user.referral_count,
      has_completed_tutorial: user.has_completed_tutorial,
      created_at: user.created_at,
    };
  }

  private async paginateQuery(qb: any, query: AdminListQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    if (query.page && query.limit) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
      throw new InternalServerErrorException(
        'Failed to update tutorial status',
      );
    }
  }

  async getTutorialStatus(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      const user = await this.userRepository.findOne({
        where: { id: id },
        select: ['id', 'has_completed_tutorial'],
      });

      if (!user) {
        throw new NotFoundException(ERRORS.ERROR_USER_NOT_FOUND);
      }

      return {
        has_completed_tutorial: user.has_completed_tutorial || false,
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
