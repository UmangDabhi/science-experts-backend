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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const progress_entity_1 = require("./entities/progress.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("../course/entities/course.entity");
const module_entity_1 = require("../module/entities/module.entity");
const error_message_1 = require("../Helper/message/error.message");
let ProgressService = class ProgressService {
    constructor(progressRepository, userRepository, courseRepository, moduleRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
    }
    async create(currUser, createProgressDto) {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { id: createProgressDto.course },
            });
            if (!existingCourse) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            }
            const existingModule = await this.moduleRepository.findOne({
                where: { id: createProgressDto.module },
            });
            if (!existingModule) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MODULE_NOT_FOUND);
            }
            const newEnrollment = await this.progressRepository.save({
                course: existingCourse,
                module: existingModule,
                student: { id: currUser.id },
            });
            return newEnrollment;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            if (error.code === '23505') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_ENROLLMENT_ALREADY_EXISTS);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_ENROLLMENT);
        }
    }
    async remove(currUser, id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const progress = await this.progressRepository.findOne({
                where: { id: id, student: { id: currUser.id } },
            });
            if (!progress) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_PROGRESS_NOT_FOUND);
            }
            await this.progressRepository.delete(progress.id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_PROGRESS);
        }
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(progress_entity_1.Progress)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(3, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProgressService);
//# sourceMappingURL=progress.service.js.map