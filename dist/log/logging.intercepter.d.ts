import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logRepository;
    constructor(logRepository: Repository<Log>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
