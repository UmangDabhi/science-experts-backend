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
exports.EnrollmentController = void 0;
const common_1 = require("@nestjs/common");
const enrollment_service_1 = require("./enrollment.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const update_enrollment_dto_1 = require("./dto/update-enrollment.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const constants_1 = require("../Helper/constants");
const pagination_dto_1 = require("../Helper/pagination/pagination.dto");
let EnrollmentController = class EnrollmentController {
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    create(req, createEnrollmentDto) {
        return this.enrollmentService.create(req.user, createEnrollmentDto);
    }
    findAll(paginationDto) {
        return this.enrollmentService.findAll(paginationDto);
    }
    findOne(id) {
        return this.enrollmentService.findOne(id);
    }
    update(req, id, updateEnrollmentDto) {
        return this.enrollmentService.update(req.user, id, updateEnrollmentDto);
    }
    remove(req, id) {
        return this.enrollmentService.remove(req.user, id);
    }
};
exports.EnrollmentController = EnrollmentController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_ENROLLMENT),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ENROLLMENT_CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_enrollment_dto_1.CreateEnrollmentDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_ENROLLMENT),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_ENROLLMENT_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_ENROLLMENT}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ENROLLMENT_FETCHED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_ENROLLMENT}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ENROLLMENT_UPDATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_enrollment_dto_1.UpdateEnrollmentDto]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_ENROLLMENT}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ENROLLMENT_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "remove", null);
exports.EnrollmentController = EnrollmentController = __decorate([
    (0, common_1.Controller)('enrollment'),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentController);
//# sourceMappingURL=enrollment.controller.js.map