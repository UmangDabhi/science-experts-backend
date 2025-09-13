import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { Material } from 'src/material/entities/material.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { BookPurchase } from 'src/books/entities/book_purchase.entity';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { PaperPurchase } from 'src/papers/entities/paper_purchase.entity';
import { FileService } from 'src/file/file.service';
import { Role } from 'src/Helper/constants';

@Injectable()
export class SecureDownloadService {
  private readonly logger = new Logger(SecureDownloadService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
    @InjectRepository(BookPurchase)
    private readonly bookPurchaseRepository: Repository<BookPurchase>,
    @InjectRepository(MaterialPurchase)
    private readonly materialPurchaseRepository: Repository<MaterialPurchase>,
    @InjectRepository(PaperPurchase)
    private readonly paperPurchaseRepository: Repository<PaperPurchase>,
    private readonly fileService: FileService,
  ) {}

  /**
   * Generate secure download URL for a book
   */
  async getBookDownloadUrl(
    bookId: string,
    user: User,
    expiresIn: number = 3600,
  ): Promise<{ download_url: string; expires_in: number }> {
    try {
      // Find the book
      const book = await this.bookRepository.findOne({
        where: { id: bookId },
        relations: ['tutor'],
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }
      // Only check access if the book is paid
      if (book.is_paid === true) {
        const hasAccess = await this.checkBookAccess(bookId, user);
        if (!hasAccess) {
          throw new ForbiddenException(
            'You do not have access to download this book',
          );
        }
      }

      // Generate signed URL
      const s3Key = this.fileService.extractS3KeyFromUrl(book.book_url);
      if (!s3Key) {
        throw new Error('Invalid book URL');
      }

      const downloadUrl = await this.fileService.generateDownloadSignedUrl(
        s3Key,
        expiresIn,
      );

      this.logger.log(
        `Generated download URL for book ${bookId} for user ${user.id}`,
      );

      return {
        download_url: downloadUrl,
        expires_in: expiresIn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate book download URL: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Generate secure download URL for a material
   */
  async getMaterialDownloadUrl(
    materialId: string,
    user: User,
    expiresIn: number = 3600,
  ): Promise<{ download_url: string; expires_in: number }> {
    try {
      // Find the material
      const material = await this.materialRepository.findOne({
        where: { id: materialId },
        relations: ['tutor'],
      });

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      // Only check access if the material is paid
      if (material.amount && +material.amount > 0) {
        // Check access permissions
        const hasAccess = await this.checkMaterialAccess(materialId, user);
        if (!hasAccess) {
          throw new ForbiddenException(
            'You do not have access to download this material',
          );
        }
      }

      // Generate signed URL
      const s3Key = this.fileService.extractS3KeyFromUrl(material.material_url);
      if (!s3Key) {
        throw new Error('Invalid material URL');
      }

      const downloadUrl = await this.fileService.generateDownloadSignedUrl(
        s3Key,
        expiresIn,
      );

      this.logger.log(
        `Generated download URL for material ${materialId} for user ${user.id}`,
      );

      return {
        download_url: downloadUrl,
        expires_in: expiresIn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate material download URL: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Generate secure download URL for a paper
   */
  async getPaperDownloadUrl(
    paperId: string,
    user: User,
    expiresIn: number = 3600,
  ): Promise<{ download_url: string; expires_in: number }> {
    try {
      // Find the paper
      const paper = await this.paperRepository.findOne({
        where: { id: paperId },
        relations: ['tutor'],
      });

      if (!paper) {
        throw new NotFoundException('Paper not found');
      }
      // Only check access if the paper is paid
      if (paper.is_paid === true) {
        // Check access permissions
        const hasAccess = await this.checkPaperAccess(paperId, user);
        if (!hasAccess) {
          throw new ForbiddenException(
            'You do not have access to download this paper',
          );
        }
      }

      // Generate signed URL
      const s3Key = this.fileService.extractS3KeyFromUrl(paper.paper_url);
      if (!s3Key) {
        throw new Error('Invalid paper URL');
      }

      const downloadUrl = await this.fileService.generateDownloadSignedUrl(
        s3Key,
        expiresIn,
      );

      this.logger.log(
        `Generated download URL for paper ${paperId} for user ${user.id}`,
      );

      return {
        download_url: downloadUrl,
        expires_in: expiresIn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate paper download URL: ${error.message}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Check if user has access to download a book
   */
  private async checkBookAccess(bookId: string, user: User): Promise<boolean> {
    // Admin has access to everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user is the tutor who created the book
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['tutor'],
    });

    if (book && book.tutor && book.tutor.id === user.id) {
      return true;
    }

    // Check if user has purchased the book
    const purchase = await this.bookPurchaseRepository.findOne({
      where: {
        book: { id: bookId },
        student: { id: user.id },
      },
    });

    return !!purchase;
  }

  /**
   * Check if user has access to download a material
   */
  private async checkMaterialAccess(
    materialId: string,
    user: User,
  ): Promise<boolean> {
    // Admin has access to everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user is the tutor who created the material
    const material = await this.materialRepository.findOne({
      where: { id: materialId },
      relations: ['tutor'],
    });

    if (material && material.tutor && material.tutor.id === user.id) {
      return true;
    }

    // Check if user has purchased the material
    const purchase = await this.materialPurchaseRepository.findOne({
      where: {
        material: { id: materialId },
        student: { id: user.id },
      },
    });

    return !!purchase;
  }

  /**
   * Check if user has access to download a paper
   */
  private async checkPaperAccess(
    paperId: string,
    user: User,
  ): Promise<boolean> {
    // Admin has access to everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user is the tutor who created the paper
    const paper = await this.paperRepository.findOne({
      where: { id: paperId },
      relations: ['tutor'],
    });

    if (paper && paper.tutor && paper.tutor.id === user.id) {
      return true;
    }

    // Check if user has purchased the paper
    const purchase = await this.paperPurchaseRepository.findOne({
      where: {
        paper: { id: paperId },
        student: { id: user.id },
      },
    });

    return !!purchase;
  }
}
