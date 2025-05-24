import { IsUUID } from "class-validator";

export class CreateBookPurchaseDto {
    @IsUUID()
    book: string;
}
