import { IsString, Length } from 'class-validator';

export class CreateLanguageDto {
    @IsString()
    @Length(1, 30)
    language: string;
}