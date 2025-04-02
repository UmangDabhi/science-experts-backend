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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const progress_service_1 = require("./progress.service");
const create_progress_dto_1 = require("./dto/create-progress.dto");
const passport_1 = require("@nestjs/passport");
const api_message_1 = require("../Helper/message/api.message");
const resposne_message_1 = require("../Helper/message/resposne.message");
const constants_1 = require("../Helper/constants");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    create(req, createProgressDto) {
        return this.progressService.create(req.user, createProgressDto);
    }
    remove(req, id) {
        return this.progressService.remove(req.user, id);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(api_message_1.API_ENDPOINT.CREATE_PROGRESS),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.PROGRESS_CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_progress_dto_1.CreateProgressDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(`${api_message_1.API_ENDPOINT.DELETE_PROGRESS}/:id`),
    (0, constants_1.ResponseMessage)(resposne_message_1.MESSAGES.PROGRESS_DELETED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "remove", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.Controller)('progress'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map