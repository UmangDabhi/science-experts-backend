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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const update_review_dto_1 = require("./dto/update-review.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const constants_1 = require("../Helper/constants");
const pagination_dto_1 = require("../Helper/pagination/pagination.dto");
const update_testimonial_dto_1 = require("./dto/update-testimonial.dto");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    create(req, createReviewDto) {
        return this.reviewsService.create(req.user, createReviewDto);
    }
    findAll(paginationDto) {
        return this.reviewsService.findAll(paginationDto);
    }
    findAllTestimonials(paginationDto) {
        return this.reviewsService.findAllTestimonials(paginationDto);
    }
    update(req, id, updateReviewDto) {
        return this.reviewsService.update(req.user, id, updateReviewDto);
    }
    changeTestimonial(id, updateTestimonialDto) {
        return this.reviewsService.changeTestimonial(id, updateTestimonialDto);
    }
    remove(req, id) {
        return this.reviewsService.remove(req.user, id);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_REVIEW),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.REVIEW_CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_REVIEW),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_REVIEW_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_TESTIMONIALS),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_REVIEW_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAllTestimonials", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_REVIEW}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.REVIEW_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_review_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.CHANGE_TESTIMONIAL}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.REVIEW_DELETED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_testimonial_dto_1.UpdateTestimonialDto]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "changeTestimonial", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_REVIEW}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.REVIEW_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "remove", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map