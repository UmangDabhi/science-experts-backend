import { IsString, IsUUID, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentDetails {
    @IsString()
    razorpay_order_id: string;

    @IsString()
    razorpay_payment_id: string;

    @IsString()
    razorpay_signature: string;
}

export class VerifyPaymentDto {
    @IsString()
    type: string;

    @IsUUID()
    item_id: string;
    
    @IsNumber()
    amount: number;

    @IsNumber()
    coins_used: number;

    @IsObject()
    @ValidateNested()
    @Type(() => PaymentDetails)
    paymentDetails: PaymentDetails;
}
