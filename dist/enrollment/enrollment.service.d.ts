import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { User } from 'src/user/entities/user.entity';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { Enrollment } from './entities/enrollment.entity';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
export declare class EnrollmentService {
    private readonly enrollmentRepository;
    private readonly userRepository;
    private readonly courseRepository;
    constructor(enrollmentRepository: Repository<Enrollment>, userRepository: Repository<User>, courseRepository: Repository<Course>);
    create(currUser: User, createEnrollmentDto: CreateEnrollmentDto): Promise<{
        course: Course;
        student: {
            id: string;
        };
    } & Enrollment>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Enrollment>>;
    findOne(id: string): string;
    update(currUser: User, id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<void>;
    remove(currUser: User, id: string): Promise<void>;
}
