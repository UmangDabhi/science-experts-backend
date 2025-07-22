import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorReqDto } from './create-tutor_req.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTutorReqDto extends PartialType(CreateTutorReqDto) {
  @IsOptional()
  @IsString()
  reason?: string;
}
