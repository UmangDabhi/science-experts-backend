import { PartialType } from '@nestjs/mapped-types';
import { CreateCollegeCourseDto } from './create-college-course.dto';

export class UpdateCollegeCourseDto extends PartialType(CreateCollegeCourseDto) {}
