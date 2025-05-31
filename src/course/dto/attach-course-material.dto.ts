import {
  IsArray,
  IsOptional,
  IsUUID
} from 'class-validator';

export class AttachCourseMaterialDto {
  @IsUUID('4')
  course: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  material?: string[];

}
