import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @Length(0, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  material_url: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  course?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  standards?: string[];

  @IsString()
  language?: string;
}
