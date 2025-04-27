import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import 'reflect-metadata'; // Ensure this is imported
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customMessage =
      this.getCustomMessage(context) || 'Request successful';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: customMessage,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getCustomMessage(context: ExecutionContext): string | null {
    const handler = context.getHandler();
    return Reflect.getMetadata('responseMessage', handler);
  }
}
