import { Book } from 'src/books/entities/book.entity';
import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  category: string;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];

  @ManyToMany(() => Material, (material) => material.categories)
  materials: Material[];

  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}
