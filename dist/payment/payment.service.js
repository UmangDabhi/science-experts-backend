"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const Razorpay = require('razorpay');
let PaymentService = class PaymentService {
    constructor(configService) {
        this.configService = configService;
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }
    async createOrder(amount) {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        };
        try {
            const order = await this.razorpay.orders.create(options);
            return { success: true, order };
        }
        catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }
    async verifyPayment(paymentDetails) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET'))
                .update(body)
                .digest('hex');
            if (expectedSignature === razorpay_signature) {
                return razorpay_payment_id;
            }
            else {
                throw new Error('Signature Mismatch');
            }
        }
        catch (error) {
            throw new Error('Signature Mismatch');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map