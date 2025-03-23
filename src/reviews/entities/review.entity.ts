import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm';

@Entity()
export class Review extends BaseEntity {
    @Column()
    review: string;

    @Column({ type: "boolean", default: false })
    show_as_testimonials: Boolean

    @ManyToOne(() => User, user => user.progress)
    @JoinColumn({ name: "student_id" })
    student: User;

    @ManyToOne(() => Course, course => course.progress)
    @JoinColumn({ name: "course_id" })
    course: Course;

    @ManyToOne(() => ModuleEntity, module => module.progress)
    @JoinColumn({ name: "module_id" })
    module: ModuleEntity;
}
