import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    create(createModuleDto: CreateModuleDto): Promise<import("./entities/module.entity").ModuleEntity>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/module.entity").ModuleEntity>>;
    findAllByCourseId(courseId: string): Promise<import("./entities/module.entity").ModuleEntity[]>;
    findOne(id: string): Promise<import("./entities/module.entity").ModuleEntity>;
    update(id: string, updateModuleDto: UpdateModuleDto): Promise<void>;
    remove(id: string): Promise<void>;
}
