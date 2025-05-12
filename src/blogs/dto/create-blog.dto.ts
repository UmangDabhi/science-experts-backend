import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    IsUUID,
    Length
} from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @Length(0, 100)
    title: string;

    @IsString()
    description: string;

    @IsString()
    blog_content: string;

    @IsOptional()
    @IsString()
    thumbnail_url?: string;

    @IsBoolean()
    @IsOptional()
    is_approved?: boolean;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    categories?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    standards?: string[];

    @IsUUID('4')
    @IsOptional()
    language: string;
}
