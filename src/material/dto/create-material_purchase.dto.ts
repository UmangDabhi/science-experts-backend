import { IsUUID } from "class-validator";

export class CreateMaterialPurchaseDto {
    @IsUUID()
    material: string;
}
