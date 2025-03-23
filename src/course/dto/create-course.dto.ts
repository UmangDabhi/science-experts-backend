import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @Length(0, 100)
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  detail_description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsBoolean()
  is_paid: boolean;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  standards?: string[];
}
