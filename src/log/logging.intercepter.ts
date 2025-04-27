import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestWithUser } from 'src/Helper/interfaces/requestwithuser.interface';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

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
