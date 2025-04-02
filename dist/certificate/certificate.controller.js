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
exports.CertificateController = void 0;
const common_1 = require("@nestjs/common");
const certificate_service_1 = require("./certificate.service");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const update_certificate_dto_1 = require("./dto/update-certificate.dto");
let CertificateController = class CertificateController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    create(createCertificateDto) {
        return this.certificateService.create(createCertificateDto);
    }
    findAll() {
        return this.certificateService.findAll();
    }
    findOne(id) {
        return this.certificateService.findOne(+id);
    }
    update(id, updateCertificateDto) {
        return this.certificateService.update(+id, updateCertificateDto);
    }
    remove(id) {
        return this.certificateService.remove(+id);
    }
};
exports.CertificateController = CertificateController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certificate_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_certificate_dto_1.UpdateCertificateDto]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificateController.prototype, "remove", null);
exports.CertificateController = CertificateController = __decorate([
    (0, common_1.Controller)('certificate'),
    __metadata("design:paramtypes", [certificate_service_1.CertificateService])
], CertificateController);
//# sourceMappingURL=certificate.controller.js.map