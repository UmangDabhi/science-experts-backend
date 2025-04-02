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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const error_message_1 = require("../Helper/message/error.message");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
const category_entity_1 = require("../category/entities/category.entity");
const standard_entity_1 = require("../standard/entities/standard.entity");
let CourseService = class CourseService {
    constructor(courseRepository, categoryRepository, standardRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.standardRepository = standardRepository;
    }
    async create(currUser, createCourseDto) {
        try {
            const categoryEntities = createCourseDto.categories
                ? await this.categoryRepository.findBy({
                    id: (0, typeorm_2.In)(createCourseDto.categories),
                })
                : [];
            const standardEntities = createCourseDto.standards
                ? await this.standardRepository.findBy({
                    id: (0, typeorm_2.In)(createCourseDto.standards),
                })
                : [];
            const newCourse = this.courseRepository.create({
                ...createCourseDto,
                tutor: { id: currUser.id },
                categories: categoryEntities,
                standards: standardEntities,
            });
            return await this.courseRepository.save(newCourse);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_COURSE);
        }
    }
    async findAll(courseFilterDto) {
        try {
            const searchableFields = ['title'];
            const queryOptions = {};
            if (courseFilterDto?.category) {
                queryOptions.categories = { id: courseFilterDto.category };
            }
            if (courseFilterDto?.standard) {
                queryOptions.standards = { id: courseFilterDto.standard };
            }
            const relations = ["modules", "enrollments", "review"];
            const result = await (0, pagination_util_1.pagniateRecords)(this.courseRepository, courseFilterDto, searchableFields, queryOptions, relations);
            result.data.forEach((course) => {
                if (course.thumbnail_url) {
                    course.thumbnail_url = `${process.env.BASE_MEDIA_URL}/${course.thumbnail_url}`;
                }
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_COURSES);
        }
    }
    async findOne(id) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const course = await this.courseRepository.findOne({
                where: { id: id },
                relations: [
                    'modules',
                    'tutor',
                    'materials',
                    'categories',
                    'standards',
                    'modules.progress',
                    'review',
                    'review.student',
                ],
            });
            if (!course)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            course.thumbnail_url = `${process.env.BASE_MEDIA_URL}/${course.thumbnail_url}`;
            course.modules.forEach((module) => {
                if (module.thumbnail_url) {
                    module.thumbnail_url = `${process.env.BASE_MEDIA_URL}/${module.thumbnail_url}`;
                }
                if (module.video_url) {
                    module.video_url = `${process.env.BASE_MEDIA_URL}/${module.video_url}`;
                }
            });
            return course;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_COURSE);
        }
    }
    async update(currUser, id, updateCourseDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            const course = await this.courseRepository.findOne({
                where: { id: id, tutor: { id: currUser.id } },
            });
            if (!course)
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            const categoryEntities = updateCourseDto.categories
                ? await this.categoryRepository.findBy({
                    id: (0, typeorm_2.In)(updateCourseDto.categories),
                })
                : [];
            const standardEntities = updateCourseDto.standards
                ? await this.standardRepository.findBy({
                    id: (0, typeorm_2.In)(updateCourseDto.standards),
                })
                : [];
            const updateData = { ...updateCourseDto };
            updateData.tutor = { id: currUser.id };
            updateData.categories = categoryEntities;
            updateData.standards = standardEntities;
            await this.courseRepository.update(id, updateData);
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
            const course = await this.courseRepository.findOne({
                where: { id: id, tutor: { id: currUser.id } },
            });
            if (!course) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            }
            await this.courseRepository.softDelete(id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_COURSE);
        }
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(standard_entity_1.Standard)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map