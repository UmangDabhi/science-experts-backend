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
    @IsString()
    last_qualification: string;

    @IsNotEmpty()
    @IsString()
    school_name: string;

    @IsNotEmpty()
    @IsString()
    passing_year: string;

    @IsNotEmpty()
    @IsString()
    percentage: string;

    @IsNotEmpty()
    @IsEnum(AdmissionType, { message: 'Type must be NIOS, COLLEGE, or MBBS' })
    type: AdmissionType;

    @IsOptional()
    @IsEnum(NiosClassType, { message: 'NIOS Class Type must be from List' })
    nios_class_type?: NiosClassType;

    @IsOptional()
    @IsString()
    nios_other?: NiosClassType;

    @IsOptional()
    @IsEnum(MbbsLocation, { message: 'MBBS Location must be INDIA or ABROAD' })
    mbbs_location?: MbbsLocation;

    @IsOptional()
    @IsUUID()
    college_id?: string;

    @IsOptional()
    @IsString()
    college_course?: string;

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
