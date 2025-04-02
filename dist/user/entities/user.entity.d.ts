import { Certificate } from 'src/certificate/entities/certificate.entity';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Role } from 'src/Helper/constants';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
export declare class User extends BaseEntity {
    stu_id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    phone_no: string;
    secondary_phone_no: string;
    standard: string;
    school: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    courses: Course[];
    certificates: Certificate[];
    enrollments: Enrollment[];
    progress: Progress[];
    review: Review[];
}
