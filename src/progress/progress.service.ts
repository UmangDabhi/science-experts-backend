import 'regenerator-runtime/runtime';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fontkit from '@pdf-lib/fontkit';
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { ERRORS } from 'src/Helper/message/error.message';
import { Role } from 'src/Helper/constants';
import { Course } from 'src/course/entities/course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { FileService } from 'src/file/file.service';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    private readonly fileService: FileService,
  ) {}

  async create(currUser: User, createProgressDto: CreateProgressDto) {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { id: createProgressDto.course },
        relations: ['modules'],
      });
      if (!existingCourse) {
        throw new NotFoundException(ERRORS.ERROR_COURSE_NOT_FOUND);
      }
      const existingModule = await this.moduleRepository.findOne({
        where: { id: createProgressDto.module },
      });
      if (!existingModule) {
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);
      }

      //  1. Save the new progress record FIRST so it is included in the database counts
      const newProgress = await this.progressRepository.save({
        course: existingCourse,
        module: existingModule,
        student: { id: currUser.id },
      });
      let certificateUrl = null;
      let enrollmentId = null;

      // 2. Fetch the total modules and the updated completed module count
      const totalModules = existingCourse.modules.length;
      const completedModulesCount = await this.progressRepository.count({
        where: {
          course: { id: existingCourse.id },
          student: { id: currUser.id },
        },
      });

      // 3. Find the student's course enrollment record
      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          student: { id: currUser.id },
          course: { id: existingCourse.id },
        },
      });

      if (enrollment) {
        enrollmentId = enrollment.id;
        certificateUrl = enrollment.certificate_url || null;
        const isCourseFinished =
          totalModules > 0 && completedModulesCount >= totalModules;
        const hasCertificateGenerated = Boolean(enrollment.certificate_url);

        console.log('Total Course Modules:', totalModules);
        console.log(
          'Completed Modules Count (Includes current):',
          completedModulesCount,
        );
        console.log('Is Course Finished?:', isCourseFinished);

        if (isCourseFinished) {
          if (!enrollment.completed_at) {
            enrollment.completed_at = new Date();
            await this.enrollmentRepository.save(enrollment);
          }

          // 4. Evaluate certificate threshold safely
          if (!hasCertificateGenerated) {
            console.log(
              'Certificate generation started for enrollment:',
              enrollment.id,
            );

            const courseForCertificate = await this.courseRepository.findOne({
              where: { id: existingCourse.id },
              relations: ['tutor'],
            });
            const url = await this.generateCertificate(
              currUser,
              courseForCertificate || existingCourse,
            );
            console.log('Generated Certificate URL:', url);

            enrollment.certificate_url = url;
            certificateUrl = url;
          }

          await this.enrollmentRepository.save(enrollment);
          certificateUrl = enrollment.certificate_url || certificateUrl;
        }
      }

      return {
        ...newProgress,
        enrollment_id: enrollmentId,
        certificate_url: certificateUrl,
        is_course_finished: totalModules > 0 && completedModulesCount >= totalModules,
        completed_modules_count: completedModulesCount,
        total_modules_count: totalModules,
      };
    } catch (error) {
      console.error('Error creating progress:', error);
      if (error instanceof NotFoundException) throw error;
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_ENROLLMENT_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_ENROLLMENT);
    }
  }

  async generateCertificate(user: User, course: Course) {
    try {
      // 1️⃣ Load the template path cleanly
      const templatePath = path.join(
        process.cwd(),
        'src',
        'assets',
        'certificate.pdf',
      );
      console.log('1: Template located');
      const existingPdfBytes = fs.readFileSync(templatePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 2️⃣ Register fontkit to handle complex Unicode character sets
      pdfDoc.registerFontkit(fontkit);

      // 3️⃣ Read and embed your custom Gujarati TrueType Font
      const fontPath = path.join(
        process.cwd(),
        'src',
        'assets',
        'NotoSansGujarati-Bold.ttf',
      );
      const fontBytes = fs.readFileSync(fontPath);
      const customFont = await pdfDoc.embedFont(fontBytes);
      console.log('2: Unicode font embedded successfully');

      const firstPage = pdfDoc.getPages()[0];
      const { width } = firstPage.getSize();
      console.log('3: Page sizes captured');

      // Helper to calculate dynamic font size using the embedded custom font
      const getDynamicFontSize = (
        text: string,
        maxWidth: number,
        baseSize: number,
      ) => {
        let size = baseSize;
        // Uses customFont instead of standard Helvetica
        const textWidth = customFont.widthOfTextAtSize(text, size);
        if (textWidth > maxWidth) {
          size = (maxWidth / textWidth) * size;
        }
        return size;
      };

      // Data
      const name = user.name || '';
      const courseTitle = course.title || '';
      const dateText = new Date().toLocaleDateString();
      console.log('4: Text vectors compiled');

      // Calculate sizes safely via custom Unicode metrics
      const nameFontSize = getDynamicFontSize(name, 400, 24);
      const nameWidth = customFont.widthOfTextAtSize(name, nameFontSize);

      const courseFontSize = getDynamicFontSize(courseTitle, 500, 18);
      const courseWidth = customFont.widthOfTextAtSize(
        courseTitle,
        courseFontSize,
      );

      const dateFontSize = getDynamicFontSize(dateText, 200, 14);
      const dateWidth = customFont.widthOfTextAtSize(dateText, dateFontSize);

      // Draw Name (centered)
      firstPage.drawText(name, {
        x: width / 2 - nameWidth / 2,
        y: 275,
        size: nameFontSize,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      // Draw Course Title (centered - Now safe from encoding crashes!)
      firstPage.drawText(courseTitle, {
        x: width / 2 - courseWidth / 2,
        y: 210,
        size: courseFontSize,
        font: customFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Draw Date (centered)
      firstPage.drawText(dateText, {
        x: width / 2 - dateWidth / 2,
        y: 180,
        size: dateFontSize,
        font: customFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      console.log('5: Main fields rendered');

      // ========================
      // SIGNATURE IMAGES
      // ========================
      const signatures = await this.resolveCertificateSignatures(course);

      await this.drawStoredSignature(
        pdfDoc,
        firstPage,
        signatures.tutorSignatureUrl,
        width / 4 - 50,
        70,
      );
      console.log('6: Tutor signature processed');

      await this.drawStoredSignature(
        pdfDoc,
        firstPage,
        signatures.ceoSignatureUrl,
        (width * 3) / 4 - 50,
        70,
      );

      // 4️⃣ Save PDF changes
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);
      console.log('7: Data buffered');

      // 5️⃣ Upload to S3
      const fileName = `certificates/${user.id}_${course.id}.pdf`;
      const fileUrl = await this.fileService.uploadFileBuffer(
        pdfBuffer,
        fileName,
        'application/pdf',
      );
      console.log('8: Cloud storage complete');

      await this.enrollmentRepository.update(
        { student: { id: user.id }, course: { id: course.id } },
        { certificate_url: fileUrl, completed_at: new Date() },
      );
      console.log('9: Database synchronization closed');

      return fileUrl;
    } catch (err) {
      console.error('Error generating certificate:', err);
      throw err;
    }
  }

  async regenerateCertificate(currUser: User, enrollmentId: string) {
    try {
      if (!enrollmentId) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }

      const enrollment = await this.enrollmentRepository.findOne({
        where: { id: enrollmentId },
        relations: ['student', 'course', 'course.tutor'],
      });

      if (!enrollment) {
        throw new NotFoundException(ERRORS.ERROR_ENROLLMENT_NOT_FOUND);
      }

      if (!enrollment.certificate_url && !enrollment.completed_at) {
        throw new BadRequestException('Certificate is not ready to regenerate');
      }

      const isAdmin = currUser?.role === Role.ADMIN;
      const isOwner = enrollment.student?.id === currUser?.id;
      const isCourseTutor = enrollment.course?.tutor?.id === currUser?.id;

      if (!isAdmin && !isOwner && !isCourseTutor) {
        throw new ForbiddenException(
          'You are not allowed to regenerate this certificate',
        );
      }

      const certificateUrl = await this.generateCertificate(
        enrollment.student,
        enrollment.course,
      );

      return {
        enrollment_id: enrollment.id,
        certificate_url: certificateUrl,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error regenerating certificate');
    }
  }

  private async resolveCertificateSignatures(course: Course) {
    try {
      const adminCeo = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.ceo_signature_url')
        .where('user.role = :role', { role: Role.ADMIN })
        .andWhere('user.ceo_signature_url IS NOT NULL')
        .andWhere("user.ceo_signature_url != ''")
        .orderBy('user.created_at', 'ASC')
        .getOne();

      const fallbackAdminTutor = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.tutor_signature_url')
        .where('user.role = :role', { role: Role.ADMIN })
        .andWhere('user.tutor_signature_url IS NOT NULL')
        .andWhere("user.tutor_signature_url != ''")
        .orderBy('user.created_at', 'ASC')
        .getOne();

      const ceoSignatureUrl = adminCeo?.ceo_signature_url || null;
      const tutorSignatureUrl =
        course?.tutor?.tutor_signature_url ||
        fallbackAdminTutor?.tutor_signature_url ||
        ceoSignatureUrl ||
        null;

      return { ceoSignatureUrl, tutorSignatureUrl };
    } catch (error) {
      console.warn(
        'Certificate signatures skipped until signature columns are migrated:',
        error?.message || error,
      );
      return { ceoSignatureUrl: null, tutorSignatureUrl: null };
    }
  }

  private async readStoredFile(fileUrl: string): Promise<Buffer> {
    const key = this.fileService.extractS3KeyFromUrl(fileUrl);
    if (!key) {
      throw new Error('Invalid signature file URL');
    }

    const { stream } = await this.fileService.getObjectReadStream(key);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  private async embedImage(pdfDoc: PDFDocument, imageBytes: Buffer) {
    try {
      return await pdfDoc.embedPng(imageBytes);
    } catch {
      return await pdfDoc.embedJpg(imageBytes);
    }
  }

  private async drawStoredSignature(
    pdfDoc: PDFDocument,
    page: PDFPage,
    signatureUrl: string | null,
    x: number,
    y: number,
  ) {
    if (!signatureUrl) return;

    try {
      const signatureBytes = await this.readStoredFile(signatureUrl);
      const signatureImage = await this.embedImage(pdfDoc, signatureBytes);
      page.drawImage(signatureImage, {
        x,
        y,
        width: 100,
        height: 100,
      });
    } catch (error) {
      console.warn('Certificate signature skipped:', error?.message || error);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const progress = await this.progressRepository.findOne({
        where: { id: id, student: { id: currUser.id } },
      });
      if (!progress) {
        throw new NotFoundException(ERRORS.ERROR_PROGRESS_NOT_FOUND);
      }
      await this.progressRepository.delete(progress.id);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_PROGRESS);
    }
  }
}
