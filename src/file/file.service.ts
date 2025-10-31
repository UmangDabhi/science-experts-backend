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
  GetObjectCommand,
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
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    // Cloudflare R2 configuration (R2 is S3-compatible)
    if (
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_ACCOUNT_ID
    ) {
      throw new Error('Missing Cloudflare R2 configuration in environment variables');
    }

    this.bucketName = process.env.R2_BUCKET_NAME || 'scienceexperts-uploads';

    // R2 endpoint format: https://<account_id>.r2.cloudflarestorage.com
    const r2Endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

    // Public URL for R2 (if you have a custom domain or R2.dev subdomain)
    this.publicUrl = process.env.R2_PUBLIC_URL || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;

    this.s3 = new S3Client({
      region: 'auto', // R2 uses 'auto' for region
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
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
  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    contentType: string,
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 300,
      }); // 5 minutes
      return uploadUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }

  // Upload file using SDK (single part) - now uploads to R2
  async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const fileStream = fs.createReadStream(file.path);

    const key = `${safeFolder}/${this.generateUniqueFilename(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      await fs.promises.unlink(file.path);
      // Return R2 public URL
      return `${this.publicUrl}/${key}`;
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new InternalServerErrorException('Error uploading file to R2');
    }
  }

  async uploadLocally(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const safeFolder = this.sanitizeFolderPath(folder);
    const localFolderPath = join(localStoragePath, safeFolder);
    await fsPromises.mkdir(localFolderPath, { recursive: true });

    const uniqueFilename = this.generateUniqueFilename(file.originalname);
    const localFilePath = join(localFolderPath, uniqueFilename);

    try {
      await fsPromises.writeFile(localFilePath, file.buffer);
      const relativePath = relative(localStoragePath, localFilePath).replace(
        /\\/g,
        '/',
      );
      return relativePath;
    } catch (error) {
      console.error('Local upload error:', error);
      throw new InternalServerErrorException('Error saving file locally');
    }
  }

  async uploadFileBuffer(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3.send(command);

    return `${this.publicUrl}/${key}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ s3Url: string }> {
    const s3Url = await this.uploadToS3(file, folder);
    return { s3Url };
  }

  async deleteFromS3(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      console.error('R2 deletion error:', error);
      throw new InternalServerErrorException('Error deleting file from R2');
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
      Bucket: this.bucketName,
      Prefix: safeFolder.endsWith('/') ? safeFolder : safeFolder + '/',
    });

    try {
      const result = await this.s3.send(command);
      return result.Contents || [];
    } catch (error) {
      console.error('R2 list error:', error);
      throw new InternalServerErrorException('Error listing files from R2');
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
      throw new InternalServerErrorException(
        'Error listing files from local folder',
      );
    }
  }

  getMulterOptions() {
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const folderPath = this.sanitizeFolderPath(
            req.params.folderPath || 'default',
          );
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
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      const response = await this.s3.send(command);
      if (!response.UploadId) {
        throw new InternalServerErrorException(
          'Failed to initiate multipart upload',
        );
      }
      return { uploadId: response.UploadId, key };
    } catch (error) {
      console.error('Error initiating multipart upload:', error);
      throw new InternalServerErrorException(
        'Could not initiate multipart upload',
      );
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
          Bucket: this.bucketName,
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
      throw new InternalServerErrorException(
        'Could not generate presigned URLs for parts',
      );
    }
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<string> {
    const completedParts: CompletedPart[] = parts.map(
      ({ ETag, PartNumber }) => ({
        ETag,
        PartNumber,
      }),
    );

    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    });

    try {
      await this.s3.send(command);
      return `${this.publicUrl}/${key}`;
    } catch (error) {
      console.error('Error completing multipart upload:', error);
      throw new InternalServerErrorException(
        'Could not complete multipart upload',
      );
    }
  }

  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
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

  /**
   * Generate a signed URL for downloading/accessing an R2 object
   */
  async generateDownloadSignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      if (!key) {
        throw new Error('Object key is required');
      }
      key = decodeURIComponent(key).replace(/\+/g, ' ');

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: expiresIn, // Default: 1 hour
      });

      return signedUrl;
    } catch (error) {
      console.error('Error generating download signed URL:', error);
      throw new InternalServerErrorException('Could not generate download URL');
    }
  }

  /**
   * Extract object key from a full R2 URL
   */
  extractS3KeyFromUrl(url: string): string | null {
    if (!url || typeof url !== 'string') {
      return null;
    }

    try {
      // Handle R2 URL formats
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.startsWith('/')
        ? urlObj.pathname.slice(1)
        : urlObj.pathname;

      // R2 public URL format: https://pub-<account_id>.r2.dev/key
      if (urlObj.hostname.includes('.r2.dev') || urlObj.hostname.includes('.r2.cloudflarestorage.com')) {
        return pathname;
      }

      // Also handle legacy AWS S3 URLs for migration compatibility
      if (urlObj.hostname.includes('.s3.') && urlObj.hostname.includes('amazonaws.com')) {
        return pathname;
      }

      return pathname;
    } catch (error) {
      console.error('Failed to extract key from URL:', url, error);
      return null;
    }
  }

  /**
   * Convert a direct R2 URL to a signed URL
   */
  async convertToSignedUrl(
    directUrl: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      if (!directUrl || typeof directUrl !== 'string') {
        return directUrl;
      }

      // Check if it's an R2 or S3 URL
      if (!directUrl.includes('.r2.') && !directUrl.includes('.s3.')) {
        return directUrl; // Not a storage URL, return as-is
      }

      const objectKey = this.extractS3KeyFromUrl(directUrl);
      if (!objectKey) {
        console.warn(`Could not extract key from URL: ${directUrl}`);
        return directUrl; // Fallback to original URL
      }

      return await this.generateDownloadSignedUrl(objectKey, expiresIn);
    } catch (error) {
      console.error(`Failed to convert URL to signed URL: ${directUrl}`, error);
      return directUrl; // Fallback to original URL
    }
  }

  /**
   * Generate signed URLs for multiple S3 URLs in batch
   */
  async generateSignedUrlsForUrls(
    urls: string[],
    expiresIn: number = 3600,
  ): Promise<string[]> {
    if (!urls || urls.length === 0) {
      return [];
    }

    try {
      const signedUrlPromises = urls.map((url) =>
        this.convertToSignedUrl(url, expiresIn),
      );
      return await Promise.all(signedUrlPromises);
    } catch (error) {
      console.error('Failed to generate signed URLs in batch', error);
      return urls; // Fallback to original URLs
    }
  }
}
