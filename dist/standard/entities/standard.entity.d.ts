import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
export declare class Standard extends BaseEntity {
    standard: string;
    courses: Course[];
}
