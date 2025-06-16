import { College } from "src/college/entities/college.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class CollegeCourse extends BaseEntity {

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @ManyToMany(() => College, (college) => college.collegeCourses)
    colleges: College[];
}

