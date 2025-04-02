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
exports.StandardService = void 0;
const common_1 = require("@nestjs/common");
const standard_entity_1 = require("./entities/standard.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const error_message_1 = require("../Helper/message/error.message");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
let StandardService = class StandardService {
    constructor(standardRepository) {
        this.standardRepository = standardRepository;
    }
    async create(createStandardDto) {
        try {
            const newStandard = this.standardRepository.create(createStandardDto);
            return await this.standardRepository.save(newStandard);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_STANDARD_ALREADY_EXISTS);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_STANDARD);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['standard'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.standardRepository, paginationDto, searchableFields);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_STANDARDS);
        }
    }
    async findOne(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const standard = await this.standardRepository.findOne({
                where: { id: id },
            });
            if (!standard) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_STANDARD_NOT_FOUND);
            }
            return standard;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_STANDARD);
        }
    }
    async update(id, updateStandardDto) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const standard = await this.standardRepository.findOne({
                where: { id: id },
            });
            if (!standard) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_STANDARD_NOT_FOUND);
            }
            await this.standardRepository.update(id, updateStandardDto);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_STANDARD);
        }
    }
    async remove(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const standard = await this.standardRepository.findOne({
                where: { id: id },
            });
            if (!standard) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_STANDARD_NOT_FOUND);
            }
            await this.standardRepository.delete(standard.id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error.code == '23503') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_STANDARD_ASSIGNED_ALREADY);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_STANDARD);
        }
    }
};
exports.StandardService = StandardService;
exports.StandardService = StandardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(standard_entity_1.Standard)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StandardService);
//# sourceMappingURL=standard.service.js.map