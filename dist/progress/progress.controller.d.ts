import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    create(req: RequestWithUser, createProgressDto: CreateProgressDto): Promise<{
        course: import("../course/entities/course.entity").Course;
        module: import("../module/entities/module.entity").ModuleEntity;
        student: {
            id: string;
        };
    } & import("./entities/progress.entity").Progress>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
