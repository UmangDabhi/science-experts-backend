// src/file/file.module.ts
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [],  // Any other modules that you need (like AWS SDK, etc.)
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],  // Export FileService to be used in other modules
})
export class FileModule {}
