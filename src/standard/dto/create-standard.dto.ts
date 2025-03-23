import { IsString, Length } from 'class-validator';

export class CreateStandardDto {
  @IsString()
  @Length(1, 30)
  standard: string;
}
