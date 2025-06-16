import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    Gender,
    AdmissionType,
    NiosClassType,
    MbbsLocation,
} from '../entities/admission.entity';

class RemarkEntryDto {
    @IsString()
    remark: string;

    @IsString() // ISO date string
    time: string;
}

export class CreateAdmissionDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone_no: string;

    @IsNotEmpty()
    @IsEnum(Gender, { message: 'Gender must be Male, Female, or Others' })
    gender: Gender;

    @IsNotEmpty()
    @IsString()
    dob: string;

    @IsNotEmpty()
    @IsEnum(AdmissionType, { message: 'Type must be NIOS, COLLEGE, or MBBS' })
    type: AdmissionType;

    @IsOptional()
    @IsEnum(NiosClassType, { message: 'NIOS Class Type must be 10TH_CLASS or 12TH_CLASS' })
    nios_class_type?: NiosClassType;

    @IsOptional()
    @IsEnum(MbbsLocation, { message: 'MBBS Location must be INDIA or ABROAD' })
    mbbs_location?: MbbsLocation;

    @IsOptional()
    @IsString()
    course_list?: string;

    @IsOptional()
    @IsUUID()
    college_id?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    pincode?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RemarkEntryDto)
    remarks?: RemarkEntryDto[];
}
