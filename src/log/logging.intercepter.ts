import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Log } from './log.entity';
import { RequestWithUser } from './request-with-user.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const response = context.switchToHttp().getResponse<Response>();
        const { method, url, body } = request;
        const requestUser = request?.user ? JSON.stringify(request.user) : 'Guest';
        const startTime = Date.now();

        return next.handle().pipe(
            tap((data) => {
                this.logRepository.save({
                    method,
                    url,
                    requestBody: body,
                    responseBody: data,
                    requestUser,
                    statusCode: response.statusCode,
                    executionTime: Date.now() - startTime,
                });
            }),
            catchError((error) => {
                console.log(error);
                this.logRepository.save({
                    method,
                    url,
                    requestBody: body,
                    requestUser,
                    statusCode: response.statusCode,
                    responseBody: error?.response?.message,
                    error: error.message,
                    executionTime: Date.now() - startTime,
                });
                throw error;
            }),
        );
    }
}
