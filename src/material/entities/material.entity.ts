import { Course } from "src/course/entities/course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Material extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    material_url: string;

    @ManyToOne(() => Course, course => course.materials)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => User, (tutor) => (tutor.courses))
    @JoinColumn({ name: 'tutor_id' })
    tutor: User

    @Column()
    amount: Number;
}
