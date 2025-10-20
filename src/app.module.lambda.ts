import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AdmissionModule } from './admission/admission.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { BooksModule } from './books/books.module';
import { CategoryModule } from './category/category.module';
import { CollegeCoursesModule } from './college-courses/college-courses.module';
import { CollegeModule } from './college/college.module';
import { CourseModule } from './course/course.module';
import { EmailModule } from './email/email.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { FileModule } from './file/file.module';
import { CommonModule } from './Helper/modules/common.module';
import { LanguageModule } from './language/language.module';
import { Log } from './log/log.entity';
import { LoggingInterceptor } from './log/logging.intercepter';
import { MaterialModule } from './material/material.module';
import { ModuleModule } from './module/module.module';
import { PapersModule } from './papers/papers.module';
import { PaymentModule } from './payment/payment.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StandardModule } from './standard/standard.module';
import { TutorReqModule } from './tutor_req/tutor_req.module';
import { Balance_Type } from './user/entities/balance_type.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Cache configuration for Lambda
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');

        // Only use Redis if configured, otherwise use in-memory cache
        if (redisHost && redisHost !== '') {
          return {
            ttl: 60 * 5,
            stores: [createKeyv(`redis://${redisHost}:${configService.get<string>('REDIS_PORT', '6379')}`)],
          };
        }

        // In-memory cache fallback
        return {
          ttl: 60 * 5,
          max: 100, // Maximum number of items in cache
        };
      },
      inject: [ConfigService],
    }),

    // REMOVED: ServeStaticModule - frontend now served from S3/CloudFront
    // Static file serving is not needed in Lambda as frontend is on CloudFront

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '.env'),
    }),

    // TypeORM configuration with connection pooling for Lambda
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

        // Enable SSL for Aurora
        ssl: configService.get<string>('DB_SSL') === 'true' ? {
          rejectUnauthorized: false,
        } : false,

        // Lambda-optimized connection pooling
        extra: {
          // Reduce connection pool for Lambda
          max: 5, // Maximum connections per Lambda instance
          min: 1, // Minimum connections
          idleTimeoutMillis: 30000, // Close idle connections after 30s
          connectionTimeoutMillis: 10000, // Connection timeout 10s

          // SSL configuration
          ...(configService.get<string>('DB_SSL') === 'true' && {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
        },

        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Disable in production
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    TypeOrmModule.forFeature([Log, User, Balance_Type]),
    UserModule,
    CourseModule,
    ModuleModule,
    EnrollmentModule,
    PaymentModule,
    MaterialModule,
    AuthModule,
    FileModule,
    CategoryModule,
    StandardModule,
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
    TutorReqModule,
    CommonModule,
    EmailModule,
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
export class AppModule {}
