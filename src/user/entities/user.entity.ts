import { Certificate } from 'src/certificate/entities/certificate.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Role } from 'src/Helper/constants';
import { MaterialPurchase } from 'src/material_purchase/entities/material_purchase.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User_Balance } from './user_balance.entity';
import { QuizAttempts } from 'src/quiz/entities/quiz_attempts.entity';

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

  @OneToMany(() => Course, (course) => course.tutor, { nullable: true })
  courses: Course[];

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

  @OneToMany(() => Progress, (progress) => progress.student, { nullable: true })
  progress: Progress[];

  @OneToMany(() => Review, (review) => review.student, { nullable: true })
  review: Review[];

  @OneToMany(() => QuizAttempts, (quiz_attempts) => quiz_attempts.student, { nullable: true })
  quiz_attempts: QuizAttempts[];
}
