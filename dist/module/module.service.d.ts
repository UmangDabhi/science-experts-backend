import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleEntity } from './entities/module.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class ModuleService {
    private readonly moduleRepository;
    constructor(moduleRepository: Repository<ModuleEntity>);
    c: any;
    create(createModuleDto: CreateModuleDto): Promise<ModuleEntity>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<ModuleEntity>>;
    findAllByCourseId(courseId: string): Promise<ModuleEntity[]>;
    findOne(id: string): Promise<ModuleEntity>;
    update(id: string, updateModuleDto: UpdateModuleDto): Promise<void>;
    remove(id: string): Promise<void>;
}
