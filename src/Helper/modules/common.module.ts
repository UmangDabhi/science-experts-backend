// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from '../services/cache.service';
import { S3UrlService } from '../services/s3-url.service';
import { SecureDownloadService } from '../services/secure-download.service';
import { RedisModule } from './redis.module';
import { Book } from 'src/books/entities/book.entity';
import { Material } from 'src/material/entities/material.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { BookPurchase } from 'src/books/entities/book_purchase.entity';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { PaperPurchase } from 'src/papers/entities/paper_purchase.entity';
import { FileService } from 'src/file/file.service';

@Global()
@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([
      Book,
      Material,
      Paper,
      BookPurchase,
      MaterialPurchase,
      PaperPurchase
    ])
  ],
  providers: [CacheService, S3UrlService, SecureDownloadService, FileService],
  exports: [CacheService, S3UrlService, SecureDownloadService],
})
export class CommonModule {}
