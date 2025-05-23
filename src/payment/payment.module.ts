import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Course } from 'src/course/entities/course.entity';
import { Material } from 'src/material/entities/material.entity';
import { User } from 'src/user/entities/user.entity';
import { MaterialPurchaseService } from 'src/material_purchase/material_purchase.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { MaterialPurchase } from 'src/material_purchase/entities/material_purchase.entity';
import { User_Balance } from 'src/user/entities/user_balance.entity';
import { UserBalanceService } from 'src/user/user_balance.service';
import { Balance_Type } from 'src/user/entities/balance_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, MaterialPurchase, Enrollment, Course, Material, User, User_Balance,Balance_Type])],
  controllers: [PaymentController],
  providers: [PaymentService, MaterialPurchaseService, EnrollmentService, UserBalanceService],
})
export class PaymentModule { }
