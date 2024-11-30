import { Category } from 'src/category/entities/category.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Is_Approved, Is_Paid } from 'src/Helper/constants';
import { Material } from 'src/material/entities/material.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Course extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column({
        type: 'boolean',
        enum: Is_Paid,
        default: Is_Paid.NO,
    })
    is_paid: Boolean;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    price: number;

    @Column({
        default: 0.0,
    })
    rating: number;

    @Column({
        type: 'boolean',
        enum: Is_Approved,
        default: Is_Approved.NO,
    })
    is_approved: Boolean;

    @ManyToOne(() => User, (tutor) => (tutor.courses), { eager: true })
    @JoinColumn({ name: 'tutor_id' })
    tutor: User

    @OneToMany(() => ModuleEntity, (modules) => modules.course)
    modules: ModuleEntity[];

    @OneToMany(() => Material, (materials) => materials.course)
    materials: Material[];

    @OneToMany(() => Enrollment, (enrollments) => enrollments.course)
    enrollments: Enrollment[];

    @ManyToMany(() => Category, (categories) => categories.courses)
    categories: Category[];

    @ManyToMany(() => Standard, (standards) => standards.courses)
    standards: Standard[];
}
