import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import { join, relative, extname, normalize } from 'path';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { localStoragePath } from 'src/Helper/constants';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error('Missing AWS S3 configuration in environment variables');
    }

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  private sanitizeFolderPath(folder: string): string {
    return normalize(folder).replace(/^(\.\.(\/|\\|$))+/, '');
  }

  private generateUniqueFilename(originalFilename: string): string {
    const fileExtension = extname(originalFilename);
    return `${uuidv4()}${fileExtension}`;
  }

  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const fileContent = file.path
      ? await fsPromises.readFile(file.path)
      : file.buffer;

    const key = `${safeFolder}/${this.generateUniqueFilename(file.originalname)}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      if (file.path) {
        await fsPromises.unlink(file.path); // Delete temp file if present
      }
      return uploadResult.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }

  async uploadLocally(file: Express.Multer.File, folder: string): Promise<string> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const localFolderPath = join(localStoragePath, safeFolder);
    await fsPromises.mkdir(localFolderPath, { recursive: true });

    const uniqueFilename = this.generateUniqueFilename(file.originalname);
    const localFilePath = join(localFolderPath, uniqueFilename);

    try {
      await fsPromises.writeFile(localFilePath, file.buffer);
      const relativePath = relative(localStoragePath, localFilePath).replace(/\\/g, '/');
      return relativePath;
    } catch (error) {
      console.error('Local upload error:', error);
      throw new InternalServerErrorException('Error saving file locally');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    s3Url: string;
  }> {
    const s3Url = await this.uploadToS3(file, folder);
    return { s3Url };
  }

  async deleteFromS3(fileKey: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('S3 deletion error:', error);
      throw new InternalServerErrorException('Error deleting file from S3');
    }
  }

  async deleteLocally(filePath: string): Promise<void> {
    const fullPath = join(localStoragePath, this.sanitizeFolderPath(filePath));

    try {
      await fsPromises.unlink(fullPath);
    } catch (error) {
      console.error('Local deletion error:', error);
      throw new InternalServerErrorException('Error deleting file locally');
    }
  }

  async deleteFile(fileKey: string, localFilePath: string): Promise<void> {
    const errors = [];

    try {
      await this.deleteFromS3(fileKey);
    } catch {
      errors.push('S3 deletion failed');
    }

    try {
      await this.deleteLocally(localFilePath);
    } catch {
      errors.push('Local deletion failed');
    }

    if (errors.length) {
      throw new InternalServerErrorException(errors.join(' | '));
    }
  }

  async listFilesInS3Folder(folder: string): Promise<AWS.S3.ObjectList> {
    const safeFolder = this.sanitizeFolderPath(folder);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: safeFolder.endsWith('/') ? safeFolder : safeFolder + '/',
    };

    try {
      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      console.error('S3 list error:', error);
      throw new InternalServerErrorException('Error listing files from S3');
    }
  }

  async listFilesInLocalFolder(folder: string): Promise<string[]> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const folderPath = join(localStoragePath, safeFolder);

    try {
      const files = await fsPromises.readdir(folderPath);
      return files.map((file) => join(folderPath, file).replace(/\\/g, '/'));
    } catch (error) {
      console.error('Local list error:', error);
      throw new InternalServerErrorException('Error listing files from local folder');
    }
  }

  getMulterOptions() {
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const folderPath = this.sanitizeFolderPath(req.params.folderPath || 'default');
          const uploadPath = join(localStoragePath, folderPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    });
  }
}
