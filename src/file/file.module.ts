// src/file/file.module.ts
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // make sure this folder exists or create dynamically
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  ], // Any other modules that you need (like AWS SDK, etc.)
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService], // Export FileService to be used in other modules
})
export class FileModule { }
