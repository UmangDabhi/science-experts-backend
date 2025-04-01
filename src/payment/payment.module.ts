import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Enrollment])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
