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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const error_message_1 = require("../Helper/message/error.message");
const bcrypt = require("bcrypt");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
const constants_1 = require("../Helper/constants");
const counter_service_1 = require("../counter/counter.service");
let UserService = class UserService {
    constructor(userRepository, counterService) {
        this.userRepository = userRepository;
        this.counterService = counterService;
    }
    async create(createUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const stu_id = await this.counterService.getNextStudentId();
            const newUser = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
                stu_id: stu_id,
            });
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException(error_message_1.ERRORS.ERROR_USER_ALREADY_EXISTS);
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_USER);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['name', 'email'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.userRepository, paginationDto, searchableFields);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_USERS);
        }
    }
    async findAllTutor(paginationDto) {
        try {
            const searchableFields = ['name', 'email'];
            const queryOptions = { role: constants_1.Role.TUTOR };
            const result = await (0, pagination_util_1.pagniateRecords)(this.userRepository, paginationDto, searchableFields, queryOptions);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_TUTORS);
        }
    }
    async findOne(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_USER_NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_USER);
        }
    }
    async update(id, updateUserDto) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_USER_NOT_FOUND);
            }
            await this.userRepository.update(id, updateUserDto);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_USER);
        }
    }
    async remove(id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const user = await this.userRepository.findOne({ where: { id: id } });
            if (!user) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_USER_NOT_FOUND);
            }
            await this.userRepository.softDelete(user.id);
            return;
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_USER);
        }
    }
    async findByEmail(email) {
        try {
            if (!email) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_EMAIL_NOT_FOUND);
            }
            const user = await this.userRepository.findOne({
                where: { email: email },
            });
            if (!user) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_USER_NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_USER_BY_EMAIL);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        counter_service_1.CounterService])
], UserService);
//# sourceMappingURL=user.service.js.map