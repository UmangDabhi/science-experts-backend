import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        message: string;
        data: {
            localPath: string;
            s3Url: string;
        };
    }>;
    uploadLocally(file: Express.Multer.File, folder: string): Promise<string>;
    listFiles(folder: string): Promise<{
        message: string;
        data: {
            localFiles: string[];
            s3Files: import("aws-sdk/clients/s3").ObjectList;
        };
    }>;
    deleteFile(fileKey: string, localFilePath: string): Promise<{
        message: string;
    }>;
}
