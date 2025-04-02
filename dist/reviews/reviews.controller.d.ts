import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: RequestWithUser, createReviewDto: CreateReviewDto): Promise<{
        course: import("../course/entities/course.entity").Course;
        module: import("../module/entities/module.entity").ModuleEntity;
        student: {
            id: string;
        };
        review: string;
    } & import("./entities/review.entity").Review>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/review.entity").Review>>;
    findAllTestimonials(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/review.entity").Review>>;
    update(req: RequestWithUser, id: string, updateReviewDto: UpdateReviewDto): Promise<void>;
    changeTestimonial(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<void>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
