import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
export declare class MaterialController {
    private readonly materialService;
    constructor(materialService: MaterialService);
    create(req: RequestWithUser, createMaterialDto: CreateMaterialDto): Promise<import("./entities/material.entity").Material>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/material.entity").Material>>;
    findOne(id: string): Promise<import("./entities/material.entity").Material>;
    update(req: RequestWithUser, id: string, updateMaterialDto: UpdateMaterialDto): Promise<void>;
    remove(req: RequestWithUser, id: string): Promise<void>;
}
