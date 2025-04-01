import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ResponseMessage } from 'src/Helper/constants';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Controller('payment')
export class PaymentController {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_PAYMENT)
  @ResponseMessage(MESSAGES.PAYMENT_CREATED)
  async createOrder(@Body('amount') amount: number) {
    return this.paymentService.createOrder(amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.VERIFY_PAYMENT)
  @ResponseMessage(MESSAGES.PAYMENT_VERIFIED)
  async verifyPayment(@Body() paymentDetails: any) {
    return this.paymentService.verifyPayment(paymentDetails);
  }
}
