import { IsString, IsUUID } from "class-validator";

export class CreateReviewDto {
    @IsString()
    review: string;

    @IsUUID()
    course: string;

    @IsUUID()
    module: string;
}
