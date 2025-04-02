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
exports.MaterialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const error_message_1 = require("../Helper/message/error.message");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
const typeorm_2 = require("typeorm");
const material_entity_1 = require("./entities/material.entity");
let MaterialService = class MaterialService {
    constructor(materialRepository) {
        this.materialRepository = materialRepository;
    }
    async create(currUser, createMaterialDto) {
        try {
            const newMaterial = this.materialRepository.create({
                ...createMaterialDto,
                course: { id: createMaterialDto.course },
                tutor: { id: currUser.id },
            });
            return await this.materialRepository.save(newMaterial);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_MATERIAL);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['title'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.materialRepository, paginationDto, searchableFields);
            result.data.forEach((material) => {
                if (material.material_url) {
                    material.material_url = `${process.env.BASE_MEDIA_URL}/${material.material_url}`;
                }
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_MATERIALS);
        }
    }
    async findOne(id) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const material = await this.materialRepository.findOne({
                where: { id: id },
            });
            if (!material)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MATERIAL_NOT_FOUND);
            material.material_url = `${process.env.BASE_MEDIA_URL}/${material.material_url}`;
            return material;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_MATERIAL);
        }
    }
    async update(currUser, id, updateMaterialDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const material = await this.materialRepository.findOne({
                where: { id: id, tutor: { id: currUser.id } },
            });
            if (!material)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MATERIAL_NOT_FOUND);
            const updateData = { ...updateMaterialDto };
            updateData.tutor = { id: currUser.id };
            await this.materialRepository.update(id, updateData);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_MATERIAL);
        }
    }
    async remove(currUser, id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const material = await this.materialRepository.findOne({
                where: { id: id, tutor: { id: currUser.id } },
            });
            if (!material) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MATERIAL_NOT_FOUND);
            }
            await this.materialRepository.softDelete(id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_MATERIAL);
        }
    }
};
exports.MaterialService = MaterialService;
exports.MaterialService = MaterialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MaterialService);
//# sourceMappingURL=material.service.js.map