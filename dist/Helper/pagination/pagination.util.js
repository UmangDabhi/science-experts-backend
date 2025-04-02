"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagniateRecords = pagniateRecords;
const typeorm_1 = require("typeorm");
async function pagniateRecords(repository, paginationDto, searchableFields = [], queryOptions = {}, relations = [], orderBy) {
    const { page, limit, search } = paginationDto;
    const skip = page && limit ? (page - 1) * limit : 0;
    const searchConditions = search && searchableFields.length > 0
        ? searchableFields.map((field) => ({ [field]: (0, typeorm_1.ILike)(`%${search}%`) }))
        : [];
    const where = searchConditions.length > 0
        ? searchConditions.map((condition) => ({ ...queryOptions, ...condition }))
        : queryOptions;
    const defaultOrder = {
        field: 'created_at',
        direction: 'DESC',
    };
    const order = orderBy
        ? { [orderBy.field]: orderBy.direction }
        : { [defaultOrder.field]: defaultOrder.direction };
    if (!page || !limit) {
        const data = await repository.find({ where, relations, order });
        return { data, total: data.length };
    }
    const data = await repository.find({ where, relations, skip, take: limit, order });
    const total = await repository.count({ where, order });
    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}
//# sourceMappingURL=pagination.util.js.map