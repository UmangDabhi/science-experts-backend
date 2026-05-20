import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Counter } from 'src/counter/counter.entity';
import { CounterService } from 'src/counter/counter.service';
import { User_Balance } from './entities/user_balance.entity';
import { UserBalanceService } from './user_balance.service';
import { Balance_Type } from './entities/balance_type.entity';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      User_Balance,
      Balance_Type,
      Counter,
      Standard,
      Category,
      Language,
      College,
      CollegeCourse,
      Enrollment,
      MaterialPurchase,
      BookPurchase,
      PaperPurchase,
      Course,
      Material,
      Book,
      Paper,
      Blog,
      TutorReq,
      Admission,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserBalanceService, CounterService],
  exports: [UserService],
})
export class UserModule { }
