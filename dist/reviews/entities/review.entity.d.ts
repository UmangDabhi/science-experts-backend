import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Review extends BaseEntity {
    review: string;
    rating: number;
    show_as_testimonials: Boolean;
    student: User;
    course: Course;
    module: ModuleEntity;
}
