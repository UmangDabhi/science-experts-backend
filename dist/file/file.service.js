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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const multer = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const constants_1 = require("../Helper/constants");
let FileService = class FileService {
    constructor() {
        this.multerStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                const folderPath = req.body.folder || 'default';
                const uploadPath = (0, path_1.join)(constants_1.localStoragePath, folderPath);
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const timestamp = Date.now();
                const filename = `${(0, uuid_1.v4)()}-${timestamp}-${file.originalname}`;
                cb(null, filename);
            },
        });
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    generateUniqueFilename(originalFilename) {
        const fileExtension = (0, path_1.extname)(originalFilename);
        return `${(0, uuid_1.v4)()}${fileExtension}`;
    }
    async uploadToS3(file, folder) {
        const fileContent = await fs_1.promises.readFile(file.path);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${this.generateUniqueFilename(file.filename)}`,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        try {
            const uploadResult = await this.s3.upload(params).promise();
            await fs_1.promises.unlink(file.path);
            return uploadResult.Location;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error uploading file to S3');
        }
    }
    async uploadLocally(file, folder) {
        const localFolderPath = (0, path_1.join)(constants_1.localStoragePath, folder);
        await fs_1.promises.mkdir(localFolderPath, { recursive: true });
        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        const localFilePath = (0, path_1.join)(localFolderPath, uniqueFilename);
        await fs_1.promises.writeFile(localFilePath, file.buffer);
        const relativePath = (0, path_1.relative)(constants_1.localStoragePath, localFilePath);
        console.log(relativePath);
        return relativePath;
    }
    async uploadFile(file, folder) {
        const localPath = await this.uploadLocally(file, folder);
        const s3Url = await this.uploadToS3(file, folder);
        return { localPath, s3Url };
    }
    async deleteFromS3(fileKey) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        };
        try {
            await this.s3.deleteObject(params).promise();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting file from S3');
        }
    }
    async deleteLocally(filePath) {
        try {
            await fs_1.promises.unlink(filePath);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error deleting file locally');
        }
    }
    async deleteFile(fileKey, localFilePath) {
        await this.deleteFromS3(fileKey);
        await this.deleteLocally(localFilePath);
    }
    async listFilesInS3Folder(folder) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: folder + '/',
        };
        try {
            const result = await this.s3.listObjectsV2(params).promise();
            return result.Contents || [];
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error listing files from S3');
        }
    }
    async listFilesInLocalFolder(folder) {
        const folderPath = (0, path_1.join)(constants_1.localStoragePath, folder);
        try {
            const files = await fs_1.promises.readdir(folderPath);
            return files.map((file) => (0, path_1.join)(folderPath, file));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error listing files from local folder');
        }
    }
    getMulterOptions() {
        return multer({
            storage: this.multerStorage,
            limits: { fileSize: 10 * 1024 * 1024 },
        });
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileService);
//# sourceMappingURL=file.service.js.map