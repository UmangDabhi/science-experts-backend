import { Certificate } from 'src/certificate/entities/certificate.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Role } from 'src/Helper/constants';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User_Balance } from './user_balance.entity';
import { QuizAttempts } from 'src/quiz/entities/quiz_attempts.entity';
import { BookPurchase } from 'src/books/entities/book_purchase.entity';
import { Book } from 'src/books/entities/book.entity';
import { Material } from 'src/material/entities/material.entity';
import { PaperPurchase } from 'src/papers/entities/paper_purchase.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { Blog } from 'src/blogs/entities/blog.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  stu_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  about_me: string;

  @Column({ nullable: true })
  profile_url: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;


  @Column({ type: "varchar", length: 8, nullable: true, unique: true })
  referral_code: string;

  @Column({ default: 0 })
  referral_count: number;



  @Column({ nullable: true })
  phone_no: string;

  @Column({ nullable: true })
  secondary_phone_no: string;

  @Column({ nullable: true })
  standard: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  pincode: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'referred_by_id' })
  referred_by: User;

  @OneToMany(() => User, (user) => user.referred_by)
  referrals: User[];

  @OneToMany(() => Course, (course) => course.tutor, { nullable: true })
  tutor_courses: Course[];

  @OneToMany(() => Material, (tutor_materials) => tutor_materials.tutor, { nullable: true })
  tutor_materials: Material[];

  @OneToMany(() => Book, (tutor_books) => tutor_books.tutor, { nullable: true })
  tutor_books: Book[];

  @OneToMany(() => Paper, (tutor_papers) => tutor_papers.tutor, { nullable: true })
  tutor_papers: Paper[];

  @OneToMany(() => Course, (course) => course.tutor, { nullable: true })
  courses: Course[];

  @OneToMany(() => Blog, (blog) => blog.tutor, { nullable: true })
  blogs: Blog[];

  @OneToMany(() => User_Balance, (user_balance) => user_balance.user, { nullable: true })
  user_balance: User_Balance[];

  @OneToMany(() => Certificate, (certificates) => certificates.student, {
    nullable: true,
  })
  certificates: Certificate[];

  @OneToMany(() => Enrollment, (enrollments) => enrollments.student, {
    nullable: true,
  })
  enrollments: Enrollment[];

  @OneToMany(() => MaterialPurchase, (material_purchases) => material_purchases.student, {
    nullable: true,
  })
  material_purchases: MaterialPurchase[];

  @OneToMany(() => BookPurchase, (book_purchases) => book_purchases.student, {
    nullable: true,
  })
  book_purchases: BookPurchase[];

  @OneToMany(() => PaperPurchase, (paper_purchases) => paper_purchases.student, {
    nullable: true,
  })
  paper_purchases: PaperPurchase[];

  @OneToMany(() => Progress, (progress) => progress.student, { nullable: true })
  progress: Progress[];

  @OneToMany(() => Review, (review) => review.student, { nullable: true })
  review: Review[];

  @OneToMany(() => QuizAttempts, (quiz_attempts) => quiz_attempts.student, { nullable: true })
  quiz_attempts: QuizAttempts[];
}
