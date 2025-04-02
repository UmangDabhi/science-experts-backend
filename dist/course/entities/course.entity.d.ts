import { Category } from 'src/category/entities/category.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Material } from 'src/material/entities/material.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Course extends BaseEntity {
    title: string;
    description: string;
    detail_description: string;
    thumbnail_url: string;
    is_paid: Boolean;
    price: number;
    discount: number;
    certificate_url: string;
    rating: number;
    is_approved: Boolean;
    tutor: User;
    modules: ModuleEntity[];
    materials: Material[];
    enrollments: Enrollment[];
    progress: Progress[];
    review: Review[];
    categories: Category[];
    standards: Standard[];
}
