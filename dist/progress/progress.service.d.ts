import { CreateProgressDto } from './dto/create-progress.dto';
import { User } from 'src/user/entities/user.entity';
import { Progress } from './entities/progress.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
export declare class ProgressService {
    private readonly progressRepository;
    private readonly userRepository;
    private readonly courseRepository;
    private readonly moduleRepository;
    constructor(progressRepository: Repository<Progress>, userRepository: Repository<User>, courseRepository: Repository<Course>, moduleRepository: Repository<ModuleEntity>);
    create(currUser: User, createProgressDto: CreateProgressDto): Promise<{
        course: Course;
        module: ModuleEntity;
        student: {
            id: string;
        };
    } & Progress>;
    remove(currUser: User, id: string): Promise<void>;
}
