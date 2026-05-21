import { IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  review: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsUUID()
  course?: string;

  @IsOptional()
  @IsUUID()
  module?: string;

  @IsOptional()
  @IsUUID()
  material?: string;

  @IsOptional()
  @IsUUID()
  book?: string;

  @IsOptional()
  @IsUUID()
  paper?: string;

  @IsOptional()
  @IsUUID()
  blog?: string;
}
