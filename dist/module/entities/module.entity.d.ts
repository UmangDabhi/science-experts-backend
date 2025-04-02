import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
export declare class ModuleEntity extends BaseEntity {
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    duration: Number;
    course: Course;
    is_free_to_watch: Boolean;
    enrollments: Enrollment[];
    progress: Progress[];
    review: Review[];
}
