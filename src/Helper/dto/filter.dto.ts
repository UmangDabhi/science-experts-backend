import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/Helper/pagination/pagination.dto";

export class FilterDto extends PartialType(PaginationDto) {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    standard?: string;

    @IsOptional()
    @IsString()
    sortby?: string;
}