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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const error_message_1 = require("../Helper/message/error.message");
const enrollment_entity_1 = require("./entities/enrollment.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
const course_entity_1 = require("../course/entities/course.entity");
let EnrollmentService = class EnrollmentService {
    constructor(enrollmentRepository, userRepository, courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }
    async create(currUser, createEnrollmentDto) {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { id: createEnrollmentDto.course },
            });
            if (!existingCourse) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            }
            const newEnrollment = await this.enrollmentRepository.save({
                course: existingCourse,
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
    async findAll(paginationDto) {
        try {
            const result = await (0, pagination_util_1.pagniateRecords)(this.enrollmentRepository, paginationDto);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_ENROLLMENTS);
        }
    }
    findOne(id) {
        return `This action returns a #${id} enrollment`;
    }
    async update(currUser, id, updateEnrollmentDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const enrollment = await this.enrollmentRepository.findOne({
                where: { id: id, student: { id: currUser.id } },
            });
            if (!enrollment)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
            const updateData = { ...updateEnrollmentDto };
            await this.enrollmentRepository.update(id, updateData);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_COURSE);
        }
    }
    async remove(currUser, id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const enrollment = await this.enrollmentRepository.findOne({
                where: { id: id, student: { id: currUser.id } },
            });
            if (!enrollment) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
            }
            await this.enrollmentRepository.delete(enrollment.id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_ENROLLMENT);
        }
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map