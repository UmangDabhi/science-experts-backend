import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { CourseFilterDto } from './dto/filter-course.dto';
export declare class CourseService {
    private readonly courseRepository;
    private readonly categoryRepository;
    private readonly standardRepository;
    constructor(courseRepository: Repository<Course>, categoryRepository: Repository<Category>, standardRepository: Repository<Standard>);
    create(currUser: User, createCourseDto: CreateCourseDto): Promise<any>;
    findAll(courseFilterDto: CourseFilterDto): Promise<PaginatedResult<Course>>;
    findOne(id: string): Promise<Course>;
    update(currUser: User, id: string, updateCourseDto: UpdateCourseDto): Promise<void>;
    remove(currUser: User, id: string): Promise<void>;
}
