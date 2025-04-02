import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { Standard } from './entities/standard.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class StandardService {
    private readonly standardRepository;
    constructor(standardRepository: Repository<Standard>);
    create(createStandardDto: CreateStandardDto): Promise<Standard>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<Standard>>;
    findOne(id: string): Promise<Standard>;
    update(id: string, updateStandardDto: UpdateStandardDto): Promise<void>;
    remove(id: string): Promise<void>;
}
