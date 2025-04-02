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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const error_message_1 = require("../Helper/message/error.message");
const typeorm_1 = require("@nestjs/typeorm");
const module_entity_1 = require("./entities/module.entity");
const typeorm_2 = require("typeorm");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
let ModuleService = class ModuleService {
    constructor(moduleRepository) {
        this.moduleRepository = moduleRepository;
    }
    async create(createModuleDto) {
        try {
            const newModule = this.moduleRepository.create({
                ...createModuleDto,
                course: { id: createModuleDto.course },
            });
            return await this.moduleRepository.save(newModule);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_MODULE);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['title'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.moduleRepository, paginationDto, searchableFields);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_MODULES);
        }
    }
    async findAllByCourseId(courseId) {
        try {
            const result = await this.moduleRepository.find({
                where: {
                    course: {
                        id: courseId,
                    },
                },
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_MODULES);
        }
    }
    async findOne(id) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const module = await this.moduleRepository.findOne({ where: { id } });
            if (!module)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MODULE_NOT_FOUND);
            return module;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_MODULE);
        }
    }
    async update(id, updateModuleDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const module = await this.moduleRepository.findOne({ where: { id } });
            if (!module)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MODULE_NOT_FOUND);
            const updateData = { ...updateModuleDto };
            if (updateModuleDto.course)
                updateData.course = { id: updateModuleDto.course };
            else
                delete updateData.course;
            await this.moduleRepository.update(id, updateData);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_MODULE);
        }
    }
    async remove(id) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const module = await this.moduleRepository.findOne({ where: { id } });
            if (!module)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MODULE_NOT_FOUND);
            await this.moduleRepository.softDelete(id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_MODULE);
        }
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModuleService);
//# sourceMappingURL=module.service.js.map