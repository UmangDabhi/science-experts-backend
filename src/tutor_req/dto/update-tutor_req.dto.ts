import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorReqDto } from './create-tutor_req.dto';

export class UpdateTutorReqDto extends PartialType(CreateTutorReqDto) {}
