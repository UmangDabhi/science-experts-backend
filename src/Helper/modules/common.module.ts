// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheService } from '../services/cache.service';
import { RedisModule } from './redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CommonModule {}
