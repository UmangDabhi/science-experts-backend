import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFilterDto } from './dto/filter-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    create(req: RequestWithUser, createCourseDto: CreateCourseDto): Promise<any>;
    findAll(courseFilterDto: CourseFilterDto, data: any): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/course.entity").Course>>;
    findOne(id: string): Promise<import("./entities/course.entity").Course>;
    update(req: RequestWithUser, id: string, updateCourseDto: UpdateCourseDto): Promise<void>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
