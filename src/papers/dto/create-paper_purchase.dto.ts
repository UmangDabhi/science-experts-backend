import { IsUUID } from "class-validator";

export class CreatePaperPurchaseDto {
    @IsUUID()
    paper: string;
}
