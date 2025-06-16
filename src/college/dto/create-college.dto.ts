import { IsArray, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateCollegeDto {
    @IsString()
    @Length(1, 100)
    name: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    address?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    collegeCourses?: string[];
}
