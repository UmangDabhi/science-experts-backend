import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EmailAutomationService } from './email-automation.service';
import { EmailController } from './email.controller';
import { EmailInitializationService } from './email-initialization.service';
import { EmailService } from './email.service';
import { EmailTemplateSeeder } from './email-templates.seeder';
import { EmailBounce } from './entities/email-bounce.entity';
import { EmailLog } from './entities/email-log.entity';
import { EmailTemplate } from './entities/email-template.entity';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      EmailTemplate,
      EmailLog,
      EmailBounce,
      User,
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailAutomationService, EmailTemplateSeeder, EmailInitializationService],
  exports: [EmailService, EmailAutomationService],
})
export class EmailModule {}