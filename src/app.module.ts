import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { BooksModule } from './books/books.module';
import { CategoryModule } from './category/category.module';
import { CertificateModule } from './certificate/certificate.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { FileModule } from './file/file.module';
import { LanguageModule } from './language/language.module';
import { Log } from './log/log.entity';
import { LoggingInterceptor } from './log/logging.intercepter';
import { MaterialModule } from './material/material.module';
import { ModuleModule } from './module/module.module';
import { PaymentModule } from './payment/payment.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StandardModule } from './standard/standard.module';
import { Balance_Type } from './user/entities/balance_type.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { PapersModule } from './papers/papers.module';
import { AdmissionModule } from './admission/admission.module';
import { CollegeModule } from './college/college.module';
import { CollegeCoursesModule } from './college-courses/college-courses.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
      exclude: ['/api*', '/public*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
      envFilePath: path.resolve(__dirname, '..', '.env'), // Ensure it loads the .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // ssl: {
        //   rejectUnauthorized: false,
        // },
        // extra: {
        //   ssl: {
        //     rejectUnauthorized: false,
        //   },
        // },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Log, User, Balance_Type]),
    UserModule,
    CourseModule,
    ModuleModule,
    EnrollmentModule,
    PaymentModule,
    CertificateModule,
    MaterialModule,
    AuthModule,
    FileModule,
    CategoryModule,
    StandardModule,
    CertificateModule,
    ProgressModule,
    ReviewsModule,
    PaymentModule,
    LanguageModule,
    BlogsModule,
    QuizModule,
    BooksModule,
    PapersModule,
    AdmissionModule,
    CollegeModule,
    CollegeCoursesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
