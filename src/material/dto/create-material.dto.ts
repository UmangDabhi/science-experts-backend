import { IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateMaterialDto {
    @IsString()
    @Length(0, 100)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    material_url: string;

    @IsNumber()
    amount: Number;

    @IsString()
    course: string;
}
