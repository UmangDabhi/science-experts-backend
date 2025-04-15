import { IsBoolean, IsString, IsUUID } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    type: string;

    @IsBoolean()
    use_coins: boolean;

    @IsUUID()
    item_id: string;

}
