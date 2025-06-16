import { IsString, Length } from "class-validator";

export class CreateCollegeCourseDto {
    @IsString()
    @Length(1, 100)
    name: string;
}
