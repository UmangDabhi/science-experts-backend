import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Readable } from 'stream';

@Injectable()
export class SecureDownloadService {
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
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly fileService: FileService,
  ) {}

  private readonly viewUrlExpirySeconds = 300;

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  private async toProtectedPdfPayload(file: {
    stream: Readable;
    filename: string;
  }): Promise<{ content_base64: string; mime_type: string; filename: string }> {
    const buffer = await this.streamToBuffer(file.stream);

    return {
      content_base64: buffer.toString('base64'),
      mime_type: 'application/pdf',
      filename: file.filename,
    };
  }

  /**
   * Generate secure download URL for a book
   */
  async getBookDownloadUrl(
    _bookId: string,
    _user: User,
    _expiresIn: number = this.viewUrlExpirySeconds,
  ): Promise<{ download_url: string; expires_in: number }> {
    throw new ForbiddenException('Downloads are disabled. Please use the secure in-app viewer.');
  }

  /**
   * Generate secure download URL for a material
   */
  async getMaterialDownloadUrl(
    _materialId: string,
    _user: User,
    _expiresIn: number = this.viewUrlExpirySeconds,
  ): Promise<{ download_url: string; expires_in: number }> {
    throw new ForbiddenException('Downloads are disabled. Please use the secure in-app viewer.');
  }

  /**
   * Generate secure download URL for a paper
   */
  async getPaperDownloadUrl(
    _paperId: string,
    _user: User,
    _expiresIn: number = this.viewUrlExpirySeconds,
  ): Promise<{ download_url: string; expires_in: number }> {
    throw new ForbiddenException('Downloads are disabled. Please use the secure in-app viewer.');
  }

  async getBookViewStream(
    bookId: string,
    user: User,
  ): Promise<{ stream: Readable; filename: string; contentType?: string; contentLength?: number }> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['tutor'],
    });

    if (!book) throw new NotFoundException('Book not found');

    if (book.is_paid === true && !(await this.checkBookAccess(bookId, user))) {
      throw new ForbiddenException('You do not have access to view this book');
    }

    const s3Key = this.fileService.extractS3KeyFromUrl(book.book_url);
    if (!s3Key) throw new Error('Invalid book URL');

    const file = await this.fileService.getObjectReadStream(s3Key);
    return {
      ...file,
      filename: `${book.title || 'book'}.pdf`,
    };
  }

  async getBookViewPayload(bookId: string, user: User) {
    return this.toProtectedPdfPayload(await this.getBookViewStream(bookId, user));
  }

  async getMaterialViewStream(
    materialId: string,
    user: User,
  ): Promise<{ stream: Readable; filename: string; contentType?: string; contentLength?: number }> {
    const material = await this.materialRepository.findOne({
      where: { id: materialId },
      relations: ['tutor', 'course'],
    });

    if (!material) throw new NotFoundException('Material not found');

    if (material.amount && +material.amount > 0 && !(await this.checkMaterialAccess(materialId, user))) {
      throw new ForbiddenException('You do not have access to view this material');
    }

    const s3Key = this.fileService.extractS3KeyFromUrl(material.material_url);
    if (!s3Key) throw new Error('Invalid material URL');

    const file = await this.fileService.getObjectReadStream(s3Key);
    return {
      ...file,
      filename: `${material.title || 'material'}.pdf`,
    };
  }

  async getMaterialViewPayload(materialId: string, user: User) {
    return this.toProtectedPdfPayload(await this.getMaterialViewStream(materialId, user));
  }

  async getPaperViewStream(
    paperId: string,
    user: User,
  ): Promise<{ stream: Readable; filename: string; contentType?: string; contentLength?: number }> {
    const paper = await this.paperRepository.findOne({
      where: { id: paperId },
      relations: ['tutor'],
    });

    if (!paper) throw new NotFoundException('Paper not found');

    if (paper.is_paid === true && !(await this.checkPaperAccess(paperId, user))) {
      throw new ForbiddenException('You do not have access to view this paper');
    }

    const s3Key = this.fileService.extractS3KeyFromUrl(paper.paper_url);
    if (!s3Key) throw new Error('Invalid paper URL');

    const file = await this.fileService.getObjectReadStream(s3Key);
    return {
      ...file,
      filename: `${paper.title || 'paper'}.pdf`,
    };
  }

  async getPaperViewPayload(paperId: string, user: User) {
    return this.toProtectedPdfPayload(await this.getPaperViewStream(paperId, user));
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
      relations: ['tutor', 'course'],
    });

    if (material && material.tutor && material.tutor.id === user.id) {
      return true;
    }

    if (material?.course?.id) {
      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          course: { id: material.course.id },
          student: { id: user.id },
        },
      });
      if (enrollment) return true;
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
