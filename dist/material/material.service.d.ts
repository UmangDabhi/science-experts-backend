import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
export declare class MaterialService {
    private readonly materialRepository;
    constructor(materialRepository: Repository<Material>);
    create(currUser: User, createMaterialDto: CreateMaterialDto): Promise<Material>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<Material>>;
    findOne(id: string): Promise<Material>;
    update(currUser: User, id: string, updateMaterialDto: UpdateMaterialDto): Promise<void>;
    remove(currUser: User, id: string): Promise<void>;
}
