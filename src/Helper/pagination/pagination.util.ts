import { Repository, ILike, FindOptionsOrder } from 'typeorm';
import { PaginationDto } from './pagination.dto';
import { PaginatedResult } from './paginated-result.interface';

interface OrderBy<T> {
    field: keyof T;
    direction: 'ASC' | 'DESC';
}

export async function pagniateRecords<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    searchableFields: (keyof T)[] = [],
    queryOptions: Partial<Record<keyof T, any>> = {},
    orderBy?: OrderBy<T>
): Promise<PaginatedResult<T>> {
    const { page, limit, search } = paginationDto;

    const skip = page && limit ? (page - 1) * limit : 0;

    const searchConditions =
        search && searchableFields.length > 0
            ? searchableFields.map((field) => ({ [field]: ILike(`%${search}%`) }))
            : [];

    const where =
        searchConditions.length > 0
            ? searchConditions.map((condition) => ({ ...queryOptions, ...condition }))
            : queryOptions;

    const defaultOrder: OrderBy<T> = { field: 'created_at' as keyof T, direction: 'DESC' };
    const order: FindOptionsOrder<T> | undefined = orderBy ? { [orderBy.field]: orderBy.direction } as FindOptionsOrder<T> : { [defaultOrder.field]: defaultOrder.direction } as FindOptionsOrder<T>;

    if (!page || !limit) {
        const data = await repository.find({ where, order });
        return { data, total: data.length };
    }

    const data = await repository.find({
        where,
        skip,
        take: limit,
        order,
    });
    const  total = await repository.count({
        where,
        order,
    })

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}