import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3UrlService {
  private readonly logger = new Logger(S3UrlService.name);
  private s3: S3Client;
  private readonly defaultExpirationSeconds: number;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor() {
    // Cloudflare R2 configuration (S3-compatible)
    if (
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_ACCOUNT_ID
    ) {
      throw new Error('Missing Cloudflare R2 configuration in environment variables');
    }

    this.bucketName = process.env.R2_BUCKET_NAME || 'scienceexperts-uploads';
    this.publicUrl = process.env.R2_PUBLIC_URL || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;

    const r2Endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    this.defaultExpirationSeconds = parseInt(
      process.env.SIGNED_URL_EXPIRATION_SECONDS || '3600',
      10,
    );
  }

  /**
   * Extract object key from a full R2 or S3 URL
   */
  private extractS3Key(url: string): string | null {
    if (!url || typeof url !== 'string') {
      return null;
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      let pathname = urlObj.pathname.startsWith('/')
        ? urlObj.pathname.slice(1)
        : urlObj.pathname;

      pathname = decodeURIComponent(pathname).replace(/\+/g, ' ');

      // R2 URL format: https://pub-<account_id>.r2.dev/key
      if (hostname.includes('.r2.dev') || hostname.includes('.r2.cloudflarestorage.com')) {
        return pathname;
      }

      // Legacy AWS S3 URL formats (for migration compatibility)
      if (hostname.includes('.s3.') && hostname.includes('amazonaws.com')) {
        return pathname;
      }

      if (hostname.startsWith('s3.') && hostname.includes('amazonaws.com')) {
        const pathParts = pathname.split('/');
        if (pathParts.length > 1) {
          pathParts.shift();
          return pathParts.join('/');
        }
      }

      return pathname;
    } catch (error) {
      this.logger.warn(`Failed to extract key from URL: ${url}`, error);
      return null;
    }
  }

  /**
   * Check if a URL is an R2 or S3 URL
   */
  private isS3Url(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      return (
        hostname.includes('.r2.') ||
        (hostname.includes('s3.') && hostname.includes('amazonaws.com'))
      );
    } catch {
      return false;
    }
  }

  /**
   * Generate a signed URL for S3 object download
   */
  async generateSignedUrl(
    s3Key: string,
    expiresIn?: number,
    fieldName?: string,
  ): Promise<string> {
    try {
      if (!s3Key) {
        throw new Error('S3 key is required');
      }
      const isVideoField = fieldName === 'video_url'; // 👈 Based on field name
      const contentType = isVideoField ? 'video/mp4' : undefined;

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        ...(contentType && { ResponseContentType: contentType }),
      });
      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: expiresIn || this.defaultExpirationSeconds,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error(
        `Failed to generate signed URL for key: ${s3Key}`,
        error,
      );
      throw new InternalServerErrorException('Failed to generate signed URL');
    }
  }

  /**
   * Convert a direct S3 URL to a signed URL
   */
  async convertDirectUrlToSignedUrl(
    directUrl: string,
    expiresIn?: number,
    fieldName?: string,
  ): Promise<string> {
    try {
      if (!this.isS3Url(directUrl)) {
        // Not an S3 URL, return as-is
        return directUrl;
      }

      const s3Key = this.extractS3Key(directUrl);
      if (!s3Key) {
        this.logger.warn(`Could not extract S3 key from URL: ${directUrl}`);
        return directUrl; // Fallback to original URL
      }

      return await this.generateSignedUrl(s3Key, expiresIn, fieldName);
    } catch (error) {
      this.logger.error(
        `Failed to convert URL to signed URL: ${directUrl}`,
        error,
      );
      return directUrl; // Fallback to original URL
    }
  }

  /**
   * Generate signed URLs for multiple S3 URLs in batch
   */
  async generateSignedUrlsForUrls(
    urls: string[],
    expiresIn?: number,
  ): Promise<string[]> {
    if (!urls || urls.length === 0) {
      return [];
    }

    try {
      const signedUrlPromises = urls.map((url) =>
        this.convertDirectUrlToSignedUrl(url, expiresIn),
      );
      return await Promise.all(signedUrlPromises);
    } catch (error) {
      this.logger.error('Failed to generate signed URLs in batch', error);
      return urls; // Fallback to original URLs
    }
  }

  /**
   * Transform an object by converting S3 URLs to signed URLs
   */
  async transformObjectUrls(
    obj: any,
    urlFields: string[] = [],
    expiresIn?: number,
  ): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Default URL fields to check
    // Note: material_url, paper_url, book_url, thumbnail_url removed since download APIs are used
    const defaultUrlFields = [
      'video_url', // Still needed for course modules
      'profile_url', // Still needed for user profiles
      'certificate_url', // Still needed for certificates
      'image_url', // Still needed for general images
      'file_url', // Still needed for general files
      'document_url', // Still needed for general documents
    ];

    const fieldsToCheck = urlFields.length > 0 ? urlFields : defaultUrlFields;

    try {
      const transformedObj = { ...obj };

      for (const field of fieldsToCheck) {
        if (
          transformedObj[field] &&
          typeof transformedObj[field] === 'string'
        ) {
          transformedObj[field] = await this.convertDirectUrlToSignedUrl(
            transformedObj[field],
            expiresIn,
          );
        }
      }

      return transformedObj;
    } catch (error) {
      this.logger.error('Failed to transform object URLs', error);
      return obj; // Fallback to original object
    }
  }

  /**
   * Transform an array of objects by converting S3 URLs to signed URLs
   */
  async transformArrayUrls(
    array: any[],
    urlFields: string[] = [],
    expiresIn?: number,
  ): Promise<any[]> {
    if (!Array.isArray(array) || array.length === 0) {
      return array;
    }

    try {
      const transformPromises = array.map((item) =>
        this.transformObjectUrls(item, urlFields, expiresIn),
      );
      return await Promise.all(transformPromises);
    } catch (error) {
      this.logger.error('Failed to transform array URLs', error);
      return array; // Fallback to original array
    }
  }
}
