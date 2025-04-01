import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  // Create Razorpay order
  async createOrder(amount: number) {
    const options = {
      amount: amount * 100, // Convert INR to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return { success: true, order };
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async verifyPayment(paymentDetails: any) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
        .update(body)
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        return razorpay_payment_id;
      } else {
        throw new Error('Signature Mismatch');
      }
    } catch (error) {
      throw new Error('Signature Mismatch');
    }
  }
}
