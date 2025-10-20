import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class EmailInitializationService implements OnModuleInit {
  private readonly logger = new Logger(EmailInitializationService.name);

  constructor(private readonly emailService: EmailService) {}

  async onModuleInit() {
    try {
      this.logger.log('Initializing email system...');
      await this.emailService.initializeDefaultTemplates();
      this.logger.log('Email system initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize email system: ${error.message}`);
      // Don't throw error to prevent application from failing to start
    }
  }
}