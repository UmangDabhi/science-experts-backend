import { Course } from 'src/course/entities/course.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['student', 'course', 'module'])
export class Progress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.progress)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.progress)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => ModuleEntity, (module) => module.progress)
  @JoinColumn({ name: 'module_id' })
  module: ModuleEntity;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  completed_at: Date;
}
