// src/file/file.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/Helper/constants';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // Uploads a file to both local storage and S3 under a specific folder
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    const result = await this.fileService.uploadFile(file, folder || 'default');
    return {
      message: 'File uploaded successfully',
      data: result, // { localPath, s3Url }
    };
  }
  @Post('upload_locally')
  @ResponseMessage('File Uploaded')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLocally(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    console.log(file);
    const result = await this.fileService.uploadLocally(
      file,
      folder || 'default',
    );
    const responsePath = result.replace(/\\/g, '/');
    return responsePath;
  }

  @Post('list')
  async listFiles(@Body('folder') folder: string) {
    const [localFiles, s3Files] = await Promise.all([
      this.fileService.listFilesInLocalFolder(folder),
      this.fileService.listFilesInS3Folder(folder),
    ]);
    return {
      message: 'Files listed successfully',
      data: { localFiles, s3Files },
    };
  }

  // Delete files from both local and S3
  @Post('delete')
  async deleteFile(
    @Body('fileKey') fileKey: string,
    @Body('localFilePath') localFilePath: string,
  ) {
    await this.fileService.deleteFile(fileKey, localFilePath);
    return { message: 'File deleted successfully' };
  }
}
