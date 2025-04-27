import { Course } from "src/course/entities/course.entity";
import { BaseEntity } from "src/Helper/base.entity";
import { Material } from "src/material/entities/material.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Language extends BaseEntity {
    @Column({ unique: true })
    language: string;

    @OneToMany(() => Course, (course) => course.language)
    courses: Course[];

    @OneToMany(() => Material, (material) => material.language)
    materials: Material[];
}
