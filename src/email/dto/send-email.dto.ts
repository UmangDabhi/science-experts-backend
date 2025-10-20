import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsEnum(EMAIL_TEMPLATE_TYPE)
  template_type: EMAIL_TEMPLATE_TYPE;

  @IsOptional()
  template_variables?: Record<string, any>;

  @IsString()
  @IsOptional()
  user_id?: string;
}