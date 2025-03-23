import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Is_Free_To_Watch } from 'src/Helper/constants';
import { Progress } from 'src/progress/entities/progress.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('module')
export class ModuleEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  duration: Number;

  @ManyToOne(() => Course, (course) => course.modules)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: Is_Free_To_Watch,
    default: Is_Free_To_Watch.NO,
  })
  is_free_to_watch: Boolean;

  @OneToMany(() => Enrollment, (enrollments) => enrollments.course)
  enrollments: Enrollment[];

  @OneToMany(() => Progress, (progress) => progress.module)
  progress: Progress[];
}
