import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import { join, relative, extname } from 'path';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { localStoragePath } from 'src/Helper/constants';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error('Missing AWS S3 configuration in environment variables');
    }
  }

  private multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = req.body.folder || 'default';
      const uploadPath = join(localStoragePath, folderPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const filename = `${uuidv4()}-${timestamp}-${file.originalname}`;
      cb(null, filename);
    },
  });

  private generateUniqueFilename(originalFilename: string): string {
    // Get the file extension
    const fileExtension = extname(originalFilename);
    // Generate a unique filename using UUID and keep the original file extension
    return `${uuidv4()}${fileExtension}`;
  }

  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const fileContent = file.path
      ? await fsPromises.readFile(file.path)
      : file.buffer;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${this.generateUniqueFilename(file.originalname)}`,
      Body: fileContent,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();

      if (file.path) {
        await fsPromises.unlink(file.path); // Cleanup temp file if saved
      }

      return uploadResult.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }


  async uploadLocally(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const localFolderPath = join(localStoragePath, folder);
    await fsPromises.mkdir(localFolderPath, { recursive: true }); // Ensure the folder exists

    // Generate a unique filename
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    const localFilePath = join(localFolderPath, uniqueFilename);
    await fsPromises.writeFile(localFilePath, file.buffer);
    const relativePath = relative(localStoragePath, localFilePath);
    console.log(relativePath);
    return relativePath;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    // localPath: string;
    s3Url: string
  }> {
    // const localPath = await this.uploadLocally(file, folder);
    const s3Url = await this.uploadToS3(file, folder);
    return {
      // localPath,
      s3Url
    };
  }

  async deleteFromS3(fileKey: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file from S3');
    }
  }

  async deleteLocally(filePath: string): Promise<void> {
    try {
      await fsPromises.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file locally');
    }
  }

  async deleteFile(fileKey: string, localFilePath: string): Promise<void> {
    await this.deleteFromS3(fileKey);
    await this.deleteLocally(localFilePath);
  }

  async listFilesInS3Folder(folder: string): Promise<AWS.S3.ObjectList> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: folder + '/',
    };

    try {
      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      throw new InternalServerErrorException('Error listing files from S3');
    }
  }

  async listFilesInLocalFolder(folder: string): Promise<string[]> {
    const folderPath = join(localStoragePath, folder);
    try {
      const files = await fsPromises.readdir(folderPath);
      return files.map((file) => join(folderPath, file));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error listing files from local folder',
      );
    }
  }

  getMulterOptions() {
    return multer({
      storage: this.multerStorage,
      limits: { fileSize: 10 * 1024 * 1024 },
    });
  }
}
