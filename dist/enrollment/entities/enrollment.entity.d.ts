import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Enrollment extends BaseEntity {
    student: User;
    course: Course;
    course_progress: number;
    feedback: String;
    enrolled_at: Date;
    completed_at: Date;
}
