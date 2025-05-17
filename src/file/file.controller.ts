import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload/:folderPath*')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1500 * 1024 * 1024, // 500 MB
    },
  }))

  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folderPath') folderPath: string,
  ) {
    try {
      const result = await this.fileService.uploadFile(file, folderPath || 'default');
      return {
        message: 'File uploaded successfully',
        data: result,
      };
    } catch (error) {
      return {
        message: 'File upload failed',
        error: error.message,
      };
    }
  }

  @Post('upload_locally/:folderPath*')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1500 * 1024 * 1024, // 500 MB
    },
  }))

  async uploadLocally(
    @UploadedFile() file: Express.Multer.File,
    @Param('folderPath') folderPath: string,
  ) {
    try {
      const result = await this.fileService.uploadLocally(file, folderPath || 'default');
      return {
        message: 'File uploaded locally',
        path: result,
      };
    } catch (error) {
      return {
        message: 'Local file upload failed',
        error: error.message,
      };
    }
  }

  @Post('list/:folderPath*')
  async listFiles(@Param('folderPath') folderPath: string) {
    try {
      const [localFiles, s3Files] = await Promise.all([
        this.fileService.listFilesInLocalFolder(folderPath),
        this.fileService.listFilesInS3Folder(folderPath),
      ]);
      return {
        message: 'Files listed successfully',
        data: { localFiles, s3Files },
      };
    } catch (error) {
      return {
        message: 'Error listing files',
        error: error.message,
      };
    }
  }

  @Post('delete/:folderPath*')
  async deleteFile(
    @Param('folderPath') folderPath: string,
    @Body('filename') filename: string,
  ) {
    try {
      const fileKey = `${folderPath}/${filename}`;
      const localFilePath = `${folderPath}/${filename}`;
      await this.fileService.deleteFile(fileKey, localFilePath);
      return { message: 'File deleted successfully' };
    } catch (error) {
      return {
        message: 'File deletion failed',
        error: error.message,
      };
    }
  }
}
