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

  async reset(): Promise<void> {
    if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    }
  }

  async deleteMultiple(prefixes: string[]): Promise<void> {
    const client = this.getRedisClient();

    const allKeys: string[] = [];

    for (const prefix of prefixes) {
      const keys = await client.keys(`${prefix}*`);
      allKeys.push(...keys);
    }

    if (allKeys.length) {
      const uniqueKeys = Array.from(new Set(allKeys));
      await client.del(...uniqueKeys);
    }
  }

  private getRedisClient(): any {
    const store = (this.cacheManager as any).store;
    return typeof store.getClient === 'function' ? store.getClient() : store;
  }
}
