import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    create(req: RequestWithUser, createEnrollmentDto: CreateEnrollmentDto): Promise<{
        course: import("../course/entities/course.entity").Course;
        student: {
            id: string;
        };
    } & import("./entities/enrollment.entity").Enrollment>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/enrollment.entity").Enrollment>>;
    findOne(id: string): string;
    update(req: RequestWithUser, id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<void>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
