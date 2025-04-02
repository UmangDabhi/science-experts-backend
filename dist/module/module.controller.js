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
exports.ModuleController = void 0;
const common_1 = require("@nestjs/common");
const module_service_1 = require("./module.service");
const create_module_dto_1 = require("./dto/create-module.dto");
const update_module_dto_1 = require("./dto/update-module.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const constants_1 = require("../Helper/constants");
const pagination_dto_1 = require("../Helper/pagination/pagination.dto");
let ModuleController = class ModuleController {
    constructor(moduleService) {
        this.moduleService = moduleService;
    }
    create(createModuleDto) {
        return this.moduleService.create(createModuleDto);
    }
    findAll(paginationDto) {
        return this.moduleService.findAll(paginationDto);
    }
    findAllByCourseId(courseId) {
        return this.moduleService.findAllByCourseId(courseId);
    }
    findOne(id) {
        return this.moduleService.findOne(id);
    }
    update(id, updateModuleDto) {
        return this.moduleService.update(id, updateModuleDto);
    }
    remove(id) {
        return this.moduleService.remove(id);
    }
};
exports.ModuleController = ModuleController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_MODULE),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MODULE_CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_MODULE),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_MOUDLE_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_COURSE_MODULE}/:courseId`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MODULE_FETCHED),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "findAllByCourseId", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_MODULE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MODULE_FETCHED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_MODULE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MODULE_UPDATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_module_dto_1.UpdateModuleDto]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_MODULE}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MODULE_DELETED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ModuleController.prototype, "remove", null);
exports.ModuleController = ModuleController = __decorate([
    (0, common_1.Controller)('module'),
    __metadata("design:paramtypes", [module_service_1.ModuleService])
], ModuleController);
//# sourceMappingURL=module.controller.js.map