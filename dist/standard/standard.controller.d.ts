import { StandardService } from './standard.service';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class StandardController {
    private readonly standardService;
    constructor(standardService: StandardService);
    create(createStandardDto: CreateStandardDto): Promise<import("./entities/standard.entity").Standard>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/standard.entity").Standard>>;
    findOne(id: string): Promise<import("./entities/standard.entity").Standard>;
    update(id: string, updateStandardDto: UpdateStandardDto): Promise<void>;
    remove(id: string): Promise<void>;
}
