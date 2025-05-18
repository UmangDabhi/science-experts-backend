import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('presigned-url')
  async getPresignedUrl(
    @Body() body: { folderPath: string; filename: string; contentType: string }
  ) {
    const { folderPath, filename, contentType } = body;
    const key = `${folderPath}/${Date.now()}-${filename}`;
    const url = await this.fileService.getPresignedUploadUrl(
      folderPath,
      filename,
      contentType
    );
    return { uploadUrl: url, key };
  }

  @Post('upload/:folderPath*')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2000 * 1024 * 1024, // 2 GB
      },
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folderPath') folderPath: string
  ) {
    try {
      const result = await this.fileService.uploadFile(
        file,
        folderPath || 'default'
      );
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
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1500 * 1024 * 1024, // 1.5 GB
      },
    })
  )
  async uploadLocally(
    @UploadedFile() file: Express.Multer.File,
    @Param('folderPath') folderPath: string
  ) {
    try {
      const result = await this.fileService.uploadLocally(
        file,
        folderPath || 'default'
      );
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
    @Body('filename') filename: string
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

  // ===== Multipart upload endpoints =====

  // 1. Initiate multipart upload
  @Post('multipart/initiate')
  async initiateMultipartUpload(
    @Body()
    body: {
      folderPath: string;
      filename: string;
      contentType: string;
      partSize: number;
      fileSize: number;
    },
  ) {
    const { folderPath, filename, contentType, partSize, fileSize } = body;

    // Step 1: Initiate multipart upload
    const { uploadId, key } = await this.fileService.initiateMultipartUpload(folderPath, filename, contentType);

    // Step 2: Calculate part count
    const partCount = Math.ceil(fileSize / partSize);

    // Step 3: Get presigned URLs for all parts
    const presignedUrls = await this.fileService.getMultipartUploadPresignedUrls(key, uploadId, partCount);

    return { uploadId, presignedUrls, key };
  }


  // 2. Get presigned URL for part upload
  // @Post('multipart/presigned-url')
  // async getMultipartPresignedUrl(
  //   @Body()
  //   body: { key: string; uploadId: string; partNumber: number }
  // ) {
  //   try {
  //     const { key, uploadId, partNumber } = body;
  //     const url = await this.fileService.getMultipartUploadPresignedUrl(
  //       key,
  //       uploadId,
  //       partNumber
  //     );
  //     return {
  //       message: 'Presigned URL for part upload generated',
  //       uploadUrl: url,
  //     };
  //   } catch (error) {
  //     return {
  //       message: 'Failed to generate presigned URL for part',
  //       error: error.message,
  //     };
  //   }
  // }

  // 3. Complete multipart upload
  @Post('multipart/complete')
  async completeMultipartUpload(
    @Body()
    body: {
      key: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    },
  ) {
    const { key, uploadId, parts } = body;
    const url = await this.fileService.completeMultipartUpload(key, uploadId, parts);
    console.log(url)
    return url;
  }
}
