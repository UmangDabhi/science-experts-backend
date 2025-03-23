import { IsUUID } from 'class-validator';

export class CreateProgressDto {
  @IsUUID()
  course: string;

  @IsUUID()
  module: string;
}
