import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'reflect-metadata'; // Ensure this is imported

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const customMessage = this.getCustomMessage(context) || 'Request successful'; // Default message

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
        // Retrieve the custom message from handler metadata
        const handler = context.getHandler();
        return Reflect.getMetadata('responseMessage', handler);
    }
}