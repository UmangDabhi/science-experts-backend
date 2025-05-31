import { Book } from 'src/books/entities/book.entity';
import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne
} from 'typeorm';

@Entity()
export class Review extends BaseEntity {
  @Column()
  review: string;

  @Column({ type: "double precision", default: 5 })
  rating: number;

  @Column({ type: 'boolean', default: false })
  show_as_testimonials: boolean;

  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.reviews, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Material, (material) => material.reviews, { nullable: true })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Book, (book) => book.reviews, { nullable: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Paper, (paper) => paper.reviews, { nullable: true })
  @JoinColumn({ name: 'paper_id' })
  paper: Paper;

  @ManyToOne(() => ModuleEntity, (module) => module.reviews, { nullable: true })
  @JoinColumn({ name: 'module_id' })
  module: ModuleEntity;

}
