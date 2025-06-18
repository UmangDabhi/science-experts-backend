import { IsNotEmpty, IsUUID } from "class-validator";

export class GetCollegeCoursesDto {
    @IsNotEmpty()
    @IsUUID()
    collegeCourse: string;
}
