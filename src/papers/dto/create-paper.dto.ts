import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';

export class CreatePaperDto {
    @IsString()
    @Length(0, 100)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    paper_url: string;

    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    categories?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    standards?: string[];

    @IsString()
    language?: string;
}
