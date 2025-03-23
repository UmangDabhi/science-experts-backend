import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  review: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsUUID()
  course: string;

  @IsUUID()
  module: string;
}
