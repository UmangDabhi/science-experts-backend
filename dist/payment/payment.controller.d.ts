import { PaymentService } from './payment.service';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
export declare class PaymentController {
    private readonly enrollmentRepository;
    private readonly paymentService;
    constructor(enrollmentRepository: Repository<Enrollment>, paymentService: PaymentService);
    createOrder(amount: number): Promise<{
        success: boolean;
        order: any;
    }>;
    verifyPayment(paymentDetails: any): Promise<any>;
}
