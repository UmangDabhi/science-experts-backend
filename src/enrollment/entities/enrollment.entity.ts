import { Course } from "src/course/entities/course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Enrollment extends BaseEntity {

    @ManyToOne(() => User, user => user.enrollments)
    @JoinColumn({ name: "student_id" })
    student: User;

    @ManyToOne(() => Course, course => course.enrollments)
    @JoinColumn({ name: "course_id" })
    course: Course;

    @Column()
    course_progress: String;

    @Column()
    feedback: String;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    enrolled_at: Date;

    @Column()
    completed_at: Date;
}
