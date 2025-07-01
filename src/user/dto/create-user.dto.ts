import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { Role } from 'src/Helper/constants';

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(6, 100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    },
  )
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  profile_url?: string;

  @IsOptional()
  phone_no?: string;

  @IsOptional()
  secondary_phone_no?: string;

  @IsOptional()
  about_me?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  standard?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  school?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  pincode?: string;

  @IsOptional()
  @IsBoolean()
  has_referral?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  referral_code?: string;
}
