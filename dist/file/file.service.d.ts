import * as AWS from 'aws-sdk';
import * as multer from 'multer';
export declare class FileService {
    private s3;
    constructor();
    private multerStorage;
    private generateUniqueFilename;
    uploadToS3(file: Express.Multer.File, folder: string): Promise<string>;
    uploadLocally(file: Express.Multer.File, folder: string): Promise<string>;
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        localPath: string;
        s3Url: string;
    }>;
    deleteFromS3(fileKey: string): Promise<void>;
    deleteLocally(filePath: string): Promise<void>;
    deleteFile(fileKey: string, localFilePath: string): Promise<void>;
    listFilesInS3Folder(folder: string): Promise<AWS.S3.ObjectList>;
    listFilesInLocalFolder(folder: string): Promise<string[]>;
    getMulterOptions(): multer.Multer;
}
