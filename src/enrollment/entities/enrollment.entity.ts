import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['student', 'course'])
export class Enrollment extends BaseEntity {
  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ nullable: true })
  certificate_url: string;

  @Column({ nullable: true })
  feedback: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  enrolled_at: Date;

  @Column({ nullable: true })
  completed_at: Date;
}
