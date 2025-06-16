import { Admission } from "src/admission/entities/admission.entity";
import { CollegeCourse } from "src/college-courses/entities/college-course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class College extends BaseEntity {
    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Admission, (admission) => admission.college)
    admissions: Admission[];

    @ManyToMany(() => CollegeCourse, (collegeCourses) => collegeCourses.colleges)
    @JoinTable({
        name: 'college_course_mapping',
        joinColumn: { name: 'college_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'college_course_id', referencedColumnName: 'id' },
    })
    collegeCourses: CollegeCourse[];

}
