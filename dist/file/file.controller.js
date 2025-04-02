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
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const file_service_1 = require("./file.service");
const platform_express_1 = require("@nestjs/platform-express");
const constants_1 = require("../Helper/constants");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(file, folder) {
        const result = await this.fileService.uploadFile(file, folder || 'default');
        return {
            message: 'File uploaded successfully',
            data: result,
        };
    }
    async uploadLocally(file, folder) {
        console.log(file);
        const result = await this.fileService.uploadLocally(file, folder || 'default');
        const responsePath = result.replace(/\\/g, '/');
        return responsePath;
    }
    async listFiles(folder) {
        const [localFiles, s3Files] = await Promise.all([
            this.fileService.listFilesInLocalFolder(folder),
            this.fileService.listFilesInS3Folder(folder),
        ]);
        return {
            message: 'Files listed successfully',
            data: { localFiles, s3Files },
        };
    }
    async deleteFile(fileKey, localFilePath) {
        await this.fileService.deleteFile(fileKey, localFilePath);
        return { message: 'File deleted successfully' };
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload_locally'),
    (0, constants_1.ResponseMessage)('File Uploaded'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadLocally", null);
__decorate([
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)('fileKey')),
    __param(1, (0, common_1.Body)('localFilePath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "deleteFile", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map