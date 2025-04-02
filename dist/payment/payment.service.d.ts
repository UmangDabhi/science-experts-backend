import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private configService;
    private razorpay;
    constructor(configService: ConfigService);
    createOrder(amount: number): Promise<{
        success: boolean;
        order: any;
    }>;
    verifyPayment(paymentDetails: any): Promise<any>;
}
