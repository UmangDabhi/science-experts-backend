import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/Helper/constants';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { API_ENDPOINT } from 'src/Helper/message/api.message';
import { MESSAGES } from 'src/Helper/message/resposne.message';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.CREATE_PAYMENT)
  @ResponseMessage(MESSAGES.PAYMENT_CREATED)
  async createOrder(@Req() req: RequestWithUser, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createOrder(req.user, createPaymentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(API_ENDPOINT.VERIFY_PAYMENT)
  @ResponseMessage(MESSAGES.PAYMENT_VERIFIED)
  async verifyPayment(@Req() req: RequestWithUser, @Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(req.user, verifyPaymentDto);
  }
}
