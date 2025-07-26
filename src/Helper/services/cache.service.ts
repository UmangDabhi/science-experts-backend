import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl === 0 || ttl === undefined) {
      await this.cacheManager.set(key, value);
    } else {
      await this.cacheManager.set(key, value, ttl);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }

  async reset(): Promise<void> {
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
  }
}
