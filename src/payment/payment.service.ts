import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Course } from 'src/course/entities/course.entity';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { PURCHASE_OF_TYPE } from 'src/Helper/constants';
import { Material } from 'src/material/entities/material.entity';
import { MaterialPurchaseService } from 'src/material/material_purchase.service';
import { User } from 'src/user/entities/user.entity';
import { UserBalanceService } from 'src/user/user_balance.service';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Payment } from './entities/payment.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(
    private configService: ConfigService,
    private enrollmentService: EnrollmentService,
    private materialPurchaseService: MaterialPurchaseService,
    private userBalanceService: UserBalanceService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });

  }

  async createOrder(currUser: User, createPaymentDto: CreatePaymentDto) {
    let amount = 0;
    if (createPaymentDto.type === PURCHASE_OF_TYPE.COURSE) {
      const existingCourse = await this.courseRepository.findOne({ where: { id: createPaymentDto.item_id } });
      amount = (existingCourse?.price * (100 - existingCourse?.discount)) / 100;
    } else {
      const existingMaterial = await this.materialRepository.findOne({ where: { id: createPaymentDto.item_id } });
      amount = existingMaterial?.amount || 0;
    }
    const totalExpertCoins = await this.userBalanceService.getAllCoins(currUser);

    console.log(totalExpertCoins)
    const coins_to_use = createPaymentDto.use_coins
      ? Math.min(totalExpertCoins, amount)
      : 0;

    const remainingAmount = amount - coins_to_use;

    if (remainingAmount === 0) {
      await this.userBalanceService.deductCoins(currUser, coins_to_use);
      await this.userRepository.save(currUser);
      await this.afterSuccessfulPurchase(currUser, createPaymentDto.type, createPaymentDto.item_id);
      return { success: true, collect_payment: false, message: "Fully covered by coins" };
    }

    const options = {
      amount: remainingAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return { success: true, collect_payment: true, order, coins_to_use };
    } catch (error) {
      console.log(error)
      throw new Error(`Error creating order: ${error.message}`);
    }
  }


  async verifyPayment(currUser: User, verifyPaymentDto: VerifyPaymentDto) {
    try {
      const paymentDetails = verifyPaymentDto.paymentDetails;

      if (verifyPaymentDto.coins_used && verifyPaymentDto.coins_used > 0) {
        await this.userBalanceService.deductCoins(currUser, verifyPaymentDto.coins_used);
        await this.userRepository.save(currUser);
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
        .update(body)
        .digest('hex');

      console.log("razorpay_order_id", razorpay_order_id);
      console.log("razorpay_payment_id", razorpay_payment_id);
      console.log("razorpay_signature", razorpay_signature);
      console.log("expectedSignature", expectedSignature);


      if (expectedSignature === razorpay_signature) {
        await this.afterSuccessfulPurchase(currUser, verifyPaymentDto.type, verifyPaymentDto.item_id)
        await this.paymentRepository.save({ type: verifyPaymentDto.type as PURCHASE_OF_TYPE, orderId: razorpay_order_id, paymentId: razorpay_payment_id, amount: Number(verifyPaymentDto.amount) / 100 })
        return razorpay_payment_id;
      } else {
        throw new Error('Signature Mismatch');
      }
    } catch (error) {
      console.log(error)
      throw new Error('Signature Mismatch');
    }
  }

  private async afterSuccessfulPurchase(currUser: User, type: string, item_id: string) {
    if (type === PURCHASE_OF_TYPE.COURSE) {
      await this.enrollmentService.create(currUser, { course: item_id })
    } else {
      await this.materialPurchaseService.create(currUser, { material: item_id })
    }
  }
}
