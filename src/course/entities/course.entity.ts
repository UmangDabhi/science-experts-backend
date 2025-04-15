import { Category } from 'src/category/entities/category.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Is_Approved, Is_Paid } from 'src/Helper/constants';
import { Material } from 'src/material/entities/material.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Course extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  detail_description: string;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column({
    type: 'boolean',
    enum: Is_Paid,
    default: Is_Paid.NO,
  })
  is_paid: boolean;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
  })
  discount: number;

  @Column({ nullable: true })
  certificate_url: string;

  @Column({
    default: 5.0,
  })
  rating: number;

  @Column({
    type: 'boolean',
    enum: Is_Approved,
    default: Is_Approved.NO,
  })
  is_approved: boolean;

  @ManyToOne(() => User, (tutor) => tutor.courses, { eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @OneToMany(() => ModuleEntity, (modules) => modules.course)
  modules: ModuleEntity[];

  @OneToMany(() => Material, (materials) => materials.course, {
    nullable: true,
  })
  materials: Material[];

  @OneToMany(() => Enrollment, (enrollments) => enrollments.course)
  enrollments: Enrollment[];

  @OneToMany(() => Progress, (progress) => progress.course)
  progress: Progress[];

  @OneToMany(() => Review, (reviews) => reviews.course)
  reviews: Review[];

  @ManyToMany(() => Category, (categories) => categories.courses)
  @JoinTable({
    name: 'course_category_mapping',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Standard, (standards) => standards.courses)
  @JoinTable({
    name: 'course_standard_mapping',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'standard_id', referencedColumnName: 'id' },
  })
  standards: Standard[];
}
