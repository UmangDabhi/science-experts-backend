import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { S3UrlService } from '../Helper/services/s3-url.service';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SignedUrlInterceptor.name);

  constructor(private readonly s3UrlService: S3UrlService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (data) => {
        if (!data) {
          return data;
        }

        try {
          const transformedData = await this.transformResponse(data);
          return transformedData;
        } catch (error) {
          this.logger.error('Error transforming URLs to signed URLs', error);
          return data; // Return original data if transformation fails
        }
      }),
    );
  }

  private async transformResponse(data: any): Promise<any> {
    // Define URL fields that should be converted to signed URLs
    const urlFields = [
      'thumbnail_url',
      'video_url',
      'book_url',
      'material_url',
      'paper_url',
      'profile_url',
      'certificate_url',
      'image_url',
      'file_url',
      'document_url',
    ];

    if (Array.isArray(data)) {
      // Handle array of objects
      return await this.transformArray(data, urlFields);
    } else if (data && typeof data === 'object') {
      // Check if it's a paginated response
      if (data.data && Array.isArray(data.data)) {
        // Handle paginated result
        return {
          ...data,
          data: await this.transformArray(data.data, urlFields),
        };
      } else if (data.success !== undefined && data.data) {
        // Handle standard API response format
        return {
          ...data,
          data: await this.transformAnyData(data.data, urlFields),
        };
      } else {
        // Handle single object
        return await this.transformObject(data, urlFields);
      }
    }

    return data;
  }

  private async transformAnyData(data: any, urlFields: string[]): Promise<any> {
    if (Array.isArray(data)) {
      return await this.transformArray(data, urlFields);
    } else if (data && typeof data === 'object') {
      return await this.transformObject(data, urlFields);
    }
    return data;
  }

  private async transformArray(array: any[], urlFields: string[]): Promise<any[]> {
    if (!Array.isArray(array) || array.length === 0) {
      return array;
    }

    try {
      const transformPromises = array.map(item => this.transformObject(item, urlFields));
      return await Promise.all(transformPromises);
    } catch (error) {
      this.logger.error('Failed to transform array URLs', error);
      return array; // Fallback to original array
    }
  }

  private async transformObject(obj: any, urlFields: string[]): Promise<any> {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) {
      return obj;
    }

    try {
      const transformedObj = { ...obj };

      // Transform URL fields in the current object
      for (const field of urlFields) {
        if (transformedObj[field] && typeof transformedObj[field] === 'string') {
          transformedObj[field] = await this.s3UrlService.convertDirectUrlToSignedUrl(
            transformedObj[field]
          );
        }
      }

      // Recursively transform nested objects and arrays
      for (const [key, value] of Object.entries(transformedObj)) {
        if (Array.isArray(value)) {
          transformedObj[key] = await this.transformArray(value, urlFields);
        } else if (value && typeof value === 'object' && !(value instanceof Date)) {
          transformedObj[key] = await this.transformObject(value, urlFields);
        }
      }

      return transformedObj;
    } catch (error) {
      this.logger.error('Failed to transform object URLs', error);
      return obj; // Fallback to original object
    }
  }
}

/**
 * Factory function to create the interceptor
 */
export function createSignedUrlInterceptor() {
  return SignedUrlInterceptor;
}