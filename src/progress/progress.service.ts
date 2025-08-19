import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ERRORS } from 'src/Helper/message/error.message';
import { Course } from 'src/course/entities/course.entity';
import { FileService } from 'src/file/file.service';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { Progress } from './entities/progress.entity';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

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

      const totalModules = existingCourse.modules.length;
      const completedModulesCount = await this.progressRepository.count({
        where: {
          course: { id: existingCourse.id },
          student: { id: currUser.id },
        },
      });

      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          student: { id: currUser.id },
          course: { id: existingCourse.id },
        },
      });
      console.log('Enrollment:', enrollment);
      if (
        completedModulesCount === totalModules &&
        !enrollment.certificate_url
      ) {
        const url = await this.generateCertificate(currUser, existingCourse);
        console.log('Certificate URL:', url);
      }
      const newEnrollment = await this.progressRepository.save({
        course: existingCourse,
        module: existingModule,
        student: { id: currUser.id },
      });
      return newEnrollment;
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
      // 1️⃣ Load the template
      const templatePath = path.join(
        __dirname,
        '..',
        'assets',
        'certificate.pdf',
      );
      const existingPdfBytes = fs.readFileSync(templatePath);

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const firstPage = pdfDoc.getPages()[0];
      const { width } = firstPage.getSize();

      // Helper to calculate dynamic font size
      const getDynamicFontSize = (
        text: string,
        maxWidth: number,
        baseSize: number,
      ) => {
        let size = baseSize;
        const textWidth = font.widthOfTextAtSize(text, size);
        if (textWidth > maxWidth) {
          size = (maxWidth / textWidth) * size;
        }
        return size;
      };

      // Data
      const name = user.name;
      const courseTitle = course.title;
      const dateText = new Date().toLocaleDateString();

      // Dynamic sizes
      const nameFontSize = getDynamicFontSize(name, 400, 24);
      const nameWidth = font.widthOfTextAtSize(name, nameFontSize);

      const courseFontSize = getDynamicFontSize(courseTitle, 500, 18);
      const courseWidth = font.widthOfTextAtSize(courseTitle, courseFontSize);

      const dateFontSize = getDynamicFontSize(dateText, 200, 14);
      const dateWidth = font.widthOfTextAtSize(dateText, dateFontSize);

      // Draw Name (centered)
      firstPage.drawText(name, {
        x: width / 2 - nameWidth / 2,
        y: 275,
        size: nameFontSize,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw Course Title (centered)
      firstPage.drawText(courseTitle, {
        x: width / 2 - courseWidth / 2,
        y: 210,
        size: courseFontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Draw Date (centered)
      firstPage.drawText(dateText, {
        x: width / 2 - dateWidth / 2,
        y: 180,
        size: dateFontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });

      // ========================
      // SIGNATURE IMAGES
      // ========================
      const tutorBytes = fs.readFileSync(
        path.join(__dirname, '..', 'assets', 'tutor-signature.png'),
      );
      if (tutorBytes) {
        const tutorImage = await pdfDoc.embedPng(tutorBytes);

        firstPage.drawImage(tutorImage, {
          x: width / 4 - 50,
          y: 70,
          width: 100,
          height: 100,
        });
      }

      const ceoBytes = fs.readFileSync(
        path.join(__dirname, '..', 'assets', 'ceo-signature.png'),
      );
      if (ceoBytes) {
        const ceoImage = await pdfDoc.embedPng(ceoBytes);

        firstPage.drawImage(ceoImage, {
          x: (width * 3) / 4 - 50,
          y: 70,
          width: 100,
          height: 100,
        });
      }

      // 4️⃣ Save PDF
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);

      // 5️⃣ Upload to S3
      const fileName = `certificates/${user.id}_${course.id}.pdf`;
      const fileUrl = await this.fileService.uploadFileBuffer(
        pdfBuffer,
        fileName,
        'application/pdf',
      );

      await this.enrollmentRepository.update(
        { student: { id: user.id }, course: { id: course.id } },
        { certificate_url: fileUrl },
      );

      return fileUrl;
    } catch (err) {
      console.error('Error generating certificate:', err);
      throw err;
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
