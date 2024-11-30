import { CounterService } from "src/counter/counter.service";
import { Course } from "src/course/entities/course.entity";
import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Role } from "src/Helper/constants";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @Column({ nullable: true })
    stu_id: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT,
    })
    role: Role;

    @Column({ nullable: true })
    phone_no: string;

    @Column({ nullable: true })
    secondary_phone_no: string;

    @Column({ nullable: true })
    standard: string;

    @Column({ nullable: true })
    school: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    pincode: string;

    @OneToMany(() => Course, course => course.tutor, { nullable: true })
    courses: Course[];

    @OneToMany(() => Enrollment, enrollments => enrollments.student, { nullable: true })
    enrollments: Enrollment[];
}
