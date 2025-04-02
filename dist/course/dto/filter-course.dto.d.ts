import { PaginationDto } from "src/Helper/pagination/pagination.dto";
declare const CourseFilterDto_base: import("@nestjs/mapped-types").MappedType<Partial<PaginationDto>>;
export declare class CourseFilterDto extends CourseFilterDto_base {
    category?: string;
    standard?: string;
}
export {};
