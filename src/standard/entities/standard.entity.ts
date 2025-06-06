import { Book } from 'src/books/entities/book.entity';
import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity()
export class Standard extends BaseEntity {
  @Column({ unique: true })
  standard: string;

  @ManyToMany(() => Course, (course) => course.standards)
  courses: Course[];

  @ManyToMany(() => Material, (materials) => materials.standards)
  materials: Material[];

  @ManyToMany(() => Book, (book) => book.standards)
  books: Book[];
}
