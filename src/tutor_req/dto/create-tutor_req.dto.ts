import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TutorRequestStatus } from '../entities/tutor_req.entity';

export class CreateTutorReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone_no: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  qualifications?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  experience?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(TutorRequestStatus)
  status?: TutorRequestStatus;
}
