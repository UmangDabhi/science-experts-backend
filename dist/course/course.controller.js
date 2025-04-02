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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const constants_1 = require("../Helper/constants");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const filter_course_dto_1 = require("./dto/filter-course.dto");
let CourseController = class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    create(req, createCourseDto) {
        return this.courseService.create(req.user, createCourseDto);
    }
    findAll(courseFilterDto, data) {
        return this.courseService.findAll(courseFilterDto);
    }
    findOne(id) {
        return this.courseService.findOne(id);
    }
    update(req, id, updateCourseDto) {
        return this.courseService.update(req.user, id, updateCourseDto);
    }
    remove(req, id) {
        return this.courseService.remove(req.user, id);
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_COURSE),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.COURSE_CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_COURSE),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_COURSE_FETCHED),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_course_dto_1.CourseFilterDto, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_COURSE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.COURSE_FETCHED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_COURSE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.COURSE_UPDATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_COURSE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.COURSE_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "remove", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('course'),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
//# sourceMappingURL=course.controller.js.map