import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisEnabled = configService.get<string>('REDIS_ENABLED') === 'true';

        if (redisEnabled) {
          const host = configService.get<string>('REDIS_HOST', 'localhost');
          const port = configService.get<number>('REDIS_PORT', 6379);
          return new Redis({ host, port });
        }

        // Return a mock Redis client if Redis is disabled
        return {
          get: async () => null,
          set: async () => 'OK',
          del: async () => 1,
          exists: async () => 0,
          expire: async () => 1,
          ttl: async () => -1,
          keys: async () => [],
          flushdb: async () => 'OK',
          quit: async () => 'OK',
        };
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
