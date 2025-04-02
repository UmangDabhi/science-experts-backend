import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Material extends BaseEntity {
    title: string;
    description: string;
    material_url: string;
    course: Course;
    tutor: User;
    amount: Number;
}
