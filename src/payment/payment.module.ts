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

@Module({
  imports: [TypeOrmModule.forFeature([Payment, MaterialPurchase, Enrollment, Course, Material, User])],
  controllers: [PaymentController],
  providers: [PaymentService, MaterialPurchaseService, EnrollmentService],
})
export class PaymentModule { }
