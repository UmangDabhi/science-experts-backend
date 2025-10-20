import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';

export class CreateTemplateDto {
  @IsEnum(EMAIL_TEMPLATE_TYPE)
  type: EMAIL_TEMPLATE_TYPE;

  @IsString()
  subject: string;

  @IsString()
  html_body: string;

  @IsString()
  @IsOptional()
  text_body?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsString()
  @IsOptional()
  description?: string;
}