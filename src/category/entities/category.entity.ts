import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  category: string;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];
}
