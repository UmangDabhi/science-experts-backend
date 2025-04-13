import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @Length(0, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsString()
  video_url: string;

  @IsNumber()
  duration: number;

  @IsBoolean()
  is_free_to_watch: boolean;

  @IsString()
  course: string;
}
