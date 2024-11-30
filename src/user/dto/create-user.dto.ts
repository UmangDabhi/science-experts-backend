import { IsString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, Length } from 'class-validator';
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
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    phone_no?: string;

    @IsOptional()
    secondary_phone_no?: string;

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
}
