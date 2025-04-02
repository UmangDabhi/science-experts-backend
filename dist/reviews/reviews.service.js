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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../course/entities/course.entity");
const typeorm_2 = require("@nestjs/typeorm");
const module_entity_1 = require("../module/entities/module.entity");
const review_entity_1 = require("./entities/review.entity");
const error_message_1 = require("../Helper/message/error.message");
const pagination_util_1 = require("../Helper/pagination/pagination.util");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, userRepository, courseRepository, moduleRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
    }
    async create(currUser, createReviewDto) {
        try {
            const existingCourse = await this.courseRepository.findOne({
                where: { id: createReviewDto.course },
            });
            if (!existingCourse) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_COURSE_NOT_FOUND);
            }
            const existingModule = await this.moduleRepository.findOne({
                where: { id: createReviewDto.module },
            });
            if (!existingModule) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_MODULE_NOT_FOUND);
            }
            const newReview = await this.reviewRepository.save({
                course: existingCourse,
                module: existingModule,
                student: { id: currUser.id },
                review: createReviewDto.review,
            });
            return newReview;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_CREATING_REVIEW);
        }
    }
    async findAll(paginationDto) {
        try {
            const searchableFields = ['review'];
            const result = await (0, pagination_util_1.pagniateRecords)(this.reviewRepository, paginationDto, searchableFields);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_REVIEWS);
        }
    }
    async findAllTestimonials(paginationDto) {
        try {
            const searchableFields = ['review'];
            const queryOptions = { show_as_testimonials: true };
            const result = await (0, pagination_util_1.pagniateRecords)(this.reviewRepository, paginationDto, searchableFields, queryOptions);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_FETCHING_REVIEWS);
        }
    }
    async update(currUser, id, updateReviewDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            await this.reviewRepository.update({ id: id, student: { id: currUser.id } }, { review: updateReviewDto.review, rating: updateReviewDto.rating });
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_REVIEW);
        }
    }
    async changeTestimonial(id, updateTestimonialDto) {
        try {
            if (!id)
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            await this.reviewRepository.update({ id: id }, { show_as_testimonials: updateTestimonialDto.show_as_testimonials });
            return;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_UPDATING_REVIEW);
        }
    }
    async remove(currUser, id) {
        try {
            if (!id) {
                throw new common_1.BadRequestException(error_message_1.ERRORS.ERROR_ID_NOT_PROVIDED);
            }
            const review = await this.reviewRepository.findOne({
                where: { id: id, student: { id: currUser.id } },
            });
            if (!review) {
                throw new common_1.NotFoundException(error_message_1.ERRORS.ERROR_REVIEW_NOT_FOUND);
            }
            await this.reviewRepository.delete(review.id);
            return;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error_message_1.ERRORS.ERROR_DELETING_REVIEW);
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_2.InjectRepository)(course_entity_1.Course)),
    __param(3, (0, typeorm_2.InjectRepository)(module_entity_1.ModuleEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map