import { IsBoolean, IsString } from 'class-validator';

export class LinkMaterialDto {
  @IsString()
  course_id: string;

  @IsString()
  material_id: string;

  @IsBoolean()
  linked: boolean;
}
