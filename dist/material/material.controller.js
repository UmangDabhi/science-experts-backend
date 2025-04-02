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
exports.MaterialController = void 0;
const common_1 = require("@nestjs/common");
const material_service_1 = require("./material.service");
const create_material_dto_1 = require("./dto/create-material.dto");
const update_material_dto_1 = require("./dto/update-material.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const constants_1 = require("../Helper/constants");
const pagination_dto_1 = require("../Helper/pagination/pagination.dto");
let MaterialController = class MaterialController {
    constructor(materialService) {
        this.materialService = materialService;
    }
    create(req, createMaterialDto) {
        return this.materialService.create(req.user, createMaterialDto);
    }
    findAll(paginationDto) {
        return this.materialService.findAll(paginationDto);
    }
    findOne(id) {
        return this.materialService.findOne(id);
    }
    update(req, id, updateMaterialDto) {
        return this.materialService.update(req.user, id, updateMaterialDto);
    }
    remove(req, id) {
        return this.materialService.remove(req.user, id);
    }
};
exports.MaterialController = MaterialController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_MATERIAL),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MATERIAL_CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_material_dto_1.CreateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(api_message_1.API_ENDPOINT.GET_ALL_MATERIAL),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.ALL_MATERIAL_FETCHED),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MaterialController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(`${api_message_1.API_ENDPOINT.GET_MATERIAL}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MATERIAL_FETCHED),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(`${api_message_1.API_ENDPOINT.UPDATE_MATERIAL}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MATERIAL_UPDATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_material_dto_1.UpdateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_MATERIAL}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.MATERIAL_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MaterialController.prototype, "remove", null);
exports.MaterialController = MaterialController = __decorate([
    (0, common_1.Controller)('material'),
    __metadata("design:paramtypes", [material_service_1.MaterialService])
], MaterialController);
//# sourceMappingURL=material.controller.js.map