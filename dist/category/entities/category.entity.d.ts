import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
export declare class Category extends BaseEntity {
    category: string;
    courses: Course[];
}
