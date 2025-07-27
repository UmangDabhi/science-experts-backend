import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

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

  async reset(): Promise<void> {
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
  }

  async deleteMultiple(prefixes: string[]): Promise<void> {
    const allKeys: string[] = [];

    for (const prefix of prefixes) {
      const keys = await this.redisClient.keys(`${prefix}*`);
      allKeys.push(...keys);
    }
    if (allKeys.length) {
      const uniqueKeys = Array.from(new Set(allKeys));
      await this.redisClient.del(...uniqueKeys);
    }
  }
}
