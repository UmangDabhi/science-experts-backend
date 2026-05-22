import { Category } from 'src/category/entities/category.entity';
import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Language } from 'src/language/entities/language.entity';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Index,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Material extends BaseEntity {
  @Index()
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column()
  material_url: string;

  @Index()
  @ManyToOne(() => Course, (course) => course.materials, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Index()
  @ManyToOne(() => User, (tutor) => tutor.tutor_materials)
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @ManyToOne(() => Language, (language) => language.materials, {
    nullable: true,
  })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Index()
  @Column()
  amount: number;

  @ManyToMany(() => Category, (categories) => categories.materials)
  @JoinTable({
    name: 'material_category_mapping',
    joinColumn: { name: 'material_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Standard, (standards) => standards.materials)
  @JoinTable({
    name: 'material_standard_mapping',
    joinColumn: { name: 'material_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'standard_id', referencedColumnName: 'id' },
  })
  standards: Standard[];

  @OneToMany(
    () => MaterialPurchase,
    (material_purchases) => material_purchases.material,
  )
  material_purchases: MaterialPurchase[];

  @OneToMany(() => Review, (reviews) => reviews.material)
  reviews: Review[];
}
