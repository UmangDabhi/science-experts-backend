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

@Module({
  imports: [TypeOrmModule.forFeature([User, User_Balance, Balance_Type, Counter, Standard, Category, Language, College, CollegeCourse])],
  controllers: [UserController],
  providers: [UserService, UserBalanceService, CounterService],
  exports: [UserService],
})
export class UserModule { }
