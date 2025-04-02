"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const typeorm_2 = require("typeorm");
const error_message_1 = require("../Helper/message/error.message");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
let CategoryService = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        try {
            const newCategory = this.categoryRepository.create(createCategoryDto);
            return await this.categoryRepository.save(newCategory);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_CATEGORY_ALREADY_EXISTS);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_COURSE);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['category'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.categoryRepository, paginationDto, searchableFields);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_CATEGORIES);
        }
    }
    async findOne(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const category = await this.categoryRepository.findOne({
                where: { id: id },
            });
            if (!category) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_CATEGORY_NOT_FOUND);
            }
            return category;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_CATEGORY);
        }
    }
    async update(id, updateCategoryDto) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const category = await this.categoryRepository.findOne({
                where: { id: id },
            });
            if (!category) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_CATEGORY_NOT_FOUND);
            }
            await this.categoryRepository.update(id, updateCategoryDto);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_CATEGORY);
        }
    }
    async remove(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const category = await this.categoryRepository.findOne({
                where: { id: id },
            });
            if (!category) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_CATEGORY_NOT_FOUND);
            }
            await this.categoryRepository.delete(category.id);
            return;
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error.code == '23503') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_CATEGORY_ASSIGNED_ALREADY);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_CATEGORY);
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=category.service.js.map