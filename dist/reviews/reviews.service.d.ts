import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Review } from './entities/review.entity';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly userRepository;
    private readonly courseRepository;
    private readonly moduleRepository;
    constructor(reviewRepository: Repository<Review>, userRepository: Repository<User>, courseRepository: Repository<Course>, moduleRepository: Repository<ModuleEntity>);
    create(currUser: User, createReviewDto: CreateReviewDto): Promise<{
        course: Course;
        module: ModuleEntity;
        student: {
            id: string;
        };
        review: string;
    } & Review>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Review>>;
    findAllTestimonials(paginationDto: PaginationDto): Promise<PaginatedResult<Review>>;
    update(currUser: User, id: string, updateReviewDto: UpdateReviewDto): Promise<void>;
    changeTestimonial(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<void>;
    remove(currUser: User, id: string): Promise<void>;
}
