import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/material/entities/material.entity';
import { User } from 'src/user/entities/user.entity';
import { MaterialPurchaseService } from 'src/material/material_purchase.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { User_Balance } from 'src/user/entities/user_balance.entity';
import { UserBalanceService } from 'src/user/user_balance.service';
import { Balance_Type } from 'src/user/entities/balance_type.entity';
import { BookPurchase } from 'src/books/entities/book_purchase.entity';
import { BookPurchaseService } from 'src/books/book_purchase.service';
import { Book } from 'src/books/entities/book.entity';
import { PaperPurchase } from 'src/papers/entities/paper_purchase.entity';
import { PaperPurchaseService } from 'src/papers/paper_purchase.service';
import { Paper } from 'src/papers/entities/paper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, MaterialPurchase, Book, BookPurchase, Paper, PaperPurchase, Enrollment, Course, Material, User, User_Balance, Balance_Type])],
  controllers: [PaymentController],
  providers: [PaymentService, MaterialPurchaseService, BookPurchaseService, PaperPurchaseService, EnrollmentService, UserBalanceService],
})
export class PaymentModule { }
