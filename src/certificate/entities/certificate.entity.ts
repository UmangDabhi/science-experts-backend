import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Certificate extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  certificate_url: string;

  @ManyToOne(() => User, (student) => student.certificates, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
