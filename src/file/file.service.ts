import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CompletedPart,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as multer from 'multer';
import { join, relative, extname, normalize } from 'path';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { localStoragePath } from 'src/Helper/constants';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

@Injectable()
export class FileService {
  private s3: S3Client;

  constructor() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error('Missing AWS S3 configuration in environment variables');
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private sanitizeFolderPath(folder: string): string {
    return normalize(folder).replace(/^(\.\.(\/|\\|$))+/, '');
  }

  private generateUniqueFilename(originalFilename: string): string {
    const fileExtension = extname(originalFilename);
    return `${uuidv4()}${fileExtension}`;
  }

  // Simple single-part presigned URL (PUT)
  async getPresignedUploadUrl(folder: string, filename: string, contentType: string): Promise<string> {
    const key = `${folder}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 }); // 5 minutes
      return uploadUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }

  // Upload file using SDK (single part)
  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const fileStream = fs.createReadStream(file.path);

    const key = `${safeFolder}/${this.generateUniqueFilename(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      await fs.promises.unlink(file.path);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
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

  async uploadFile(file: Express.Multer.File, folder: string): Promise<{ s3Url: string }> {
    const s3Url = await this.uploadToS3(file, folder);
    return { s3Url };
  }

  async deleteFromS3(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    try {
      await this.s3.send(command);
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

  async listFilesInS3Folder(folder: string): Promise<any[]> {
    const safeFolder = this.sanitizeFolderPath(folder);

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: safeFolder.endsWith('/') ? safeFolder : safeFolder + '/',
    });

    try {
      const result = await this.s3.send(command);
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

  async initiateMultipartUpload(
    folder: string,
    filename: string,
    contentType: string,
  ): Promise<{ uploadId: string; key: string }> {
    const key = `${folder}/${Date.now()}-${filename}`;

    const command = new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    try {
      const response = await this.s3.send(command);
      if (!response.UploadId) {
        throw new InternalServerErrorException('Failed to initiate multipart upload');
      }
      return { uploadId: response.UploadId, key };
    } catch (error) {
      console.error('Error initiating multipart upload:', error);
      throw new InternalServerErrorException('Could not initiate multipart upload');
    }
  }

  async getMultipartUploadPresignedUrls(
    key: string,
    uploadId: string,
    partCount: number,
  ): Promise<string[]> {
    try {
      const presignedUrls: string[] = [];

      for (let partNumber = 1; partNumber <= partCount; partNumber++) {
        const command = new UploadPartCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: 3000 });
        presignedUrls.push(url);
      }

      return presignedUrls;
    } catch (error) {
      console.error('Error generating presigned URLs:', error);
      throw new InternalServerErrorException('Could not generate presigned URLs for parts');
    }
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<string> {
    const completedParts: CompletedPart[] = parts.map(({ ETag, PartNumber }) => ({
      ETag,
      PartNumber,
    }));

    const command = new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    });

    try {
      await this.s3.send(command);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error completing multipart upload:', error);
      throw new InternalServerErrorException('Could not complete multipart upload');
    }
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      console.error('Error aborting multipart upload:', error);
      // Optional: fail silently or rethrow
    }
  }

}