import { IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator";

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

    @IsString()
    tutor: string;
}