import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @Length(0, 100)
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @IsBoolean()
    is_paid: boolean;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    is_approved?: boolean;

    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })  // Ensure each ID is a valid UUID
    categories?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    standards?: string[];
}