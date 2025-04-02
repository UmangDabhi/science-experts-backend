import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Progress extends BaseEntity {
    student: User;
    course: Course;
    module: ModuleEntity;
    completed_at: Date;
}
