import { Course } from "src/course/entities/course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Entity,Column, ManyToMany } from "typeorm";

@Entity()
export class Standard extends BaseEntity {
    @Column({ unique: true })
    standard: string

    @ManyToMany(() => Course, (course) => course.standards)
    courses: Course[];
}
