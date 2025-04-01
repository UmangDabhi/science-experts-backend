import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CertificateModule } from './certificate/certificate.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { FileModule } from './file/file.module';
import { Log } from './log/log.entity';
import { LoggingInterceptor } from './log/logging.intercepter';
import { MaterialModule } from './material/material.module';
import { ModuleModule } from './module/module.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { StandardModule } from './standard/standard.module';
import { ProgressModule } from './progress/progress.module';
import { ReviewsModule } from './reviews/reviews.module';
import * as path from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
      // exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,  // Makes the config globally available
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
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Log]),
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
    PaymentModule
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
