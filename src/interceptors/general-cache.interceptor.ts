import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
class DynamicCacheInterceptor implements NestInterceptor {
  constructor(
    public readonly cacheKeyPrefix: string,
    @Inject(CACHE_MANAGER) public readonly cacheManager: Cache,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const { page = 1, limit = 10, search = '' } = request.query;

    const key = `${this.cacheKeyPrefix}:page=${page}&limit=${limit}&search=${search}`;
    const cached: any = await this.cacheManager.get(key);

    if (cached) {
      return of(JSON.parse(cached));
    }

    return next.handle().pipe(
      tap((response) => {
        if (response !== undefined && response !== null) {
          this.cacheManager.set(key, JSON.stringify(response));
        }
      }),
    );
  }
}

export function GeneralCacheInterceptor(prefix: string) {
  class MixinInterceptor extends DynamicCacheInterceptor {
    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
      super(prefix, cacheManager);
    }
  }

  return mixin(MixinInterceptor);
}
