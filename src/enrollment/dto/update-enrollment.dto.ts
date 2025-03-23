import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
    @IsNumber()
    @IsOptional()
    course_progress?: number;

    @IsOptional()
    feedback?: string;

    @IsOptional()
    completed_at?: Date;
}
