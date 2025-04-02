import { Repository } from 'typeorm';
import { PaginationDto } from './pagination.dto';
import { PaginatedResult } from './paginated-result.interface';
interface OrderBy<T> {
    field: keyof T;
    direction: 'ASC' | 'DESC';
}
export declare function pagniateRecords<T>(repository: Repository<T>, paginationDto: PaginationDto, searchableFields?: (keyof T)[], queryOptions?: Partial<Record<keyof T, any>>, relations?: string[], orderBy?: OrderBy<T>): Promise<PaginatedResult<T>>;
export {};
