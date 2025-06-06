import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';

export class CreateBookDto {
    @IsString()
    @Length(0, 100)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    book_url: string;

    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @IsBoolean()
    is_paid: boolean;

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
