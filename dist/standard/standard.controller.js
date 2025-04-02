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
exports.StandardController = void 0;
const common_1 = require("@nestjs/common");
const standard_service_1 = require("./standard.service");
const create_standard_dto_1 = require("./dto/create-standard.dto");
const update_standard_dto_1 = require("./dto/update-standard.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const constants_1 = require("../Helper/constants");
const resposne_message_1 = require("../Helper/message/resposne.message");
const pagination_dto_1 = require("../Helper/pagination/pagination.dto");
let StandardController = class StandardController {
    constructor(standardService) {
        this.standardService = standardService;
    }
    create(createStandardDto) {
        return this.standardService.create(createStandardDto);
    }
    findAll(paginationDto) {
        return this.standardService.findAll(paginationDto);
    }
    findOne(id) {
        return this.standardService.findOne(id);
    }
    update(id, updateStandardDto) {
        return this.standardService.update(id, updateStandardDto);
    }
    remove(id) {
        return this.standardService.remove(id);
    }
};
exports.StandardController = StandardController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_STANDARD),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.STANDARD_CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_standard_dto_1.CreateStandardDto]),
    __metadata("design:returntype", void 0)
], StandardController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_STANDARD),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_STANDARD_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], StandardController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_STANDARD}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.STANDARD_FETCHED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_STANDARD}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.STANDARD_UPDATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_standard_dto_1.UpdateStandardDto]),
    __metadata("design:returntype", void 0)
], StandardController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_STANDARD}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.STANDARD_DELETED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardController.prototype, "remove", null);
exports.StandardController = StandardController = __decorate([
    (0, common_1.Controller)('standard'),
    __metadata("design:paramtypes", [standard_service_1.StandardService])
], StandardController);
//# sourceMappingURL=standard.controller.js.map