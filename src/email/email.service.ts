import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { EMAIL_STATUS, EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailTemplateSeeder } from './email-templates.seeder';
import { EmailBounce } from './entities/email-bounce.entity';
import { EmailLog } from './entities/email-log.entity';
import { EmailTemplate } from './entities/email-template.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplateRepository: Repository<EmailTemplate>,
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
    @InjectRepository(EmailBounce)
    private emailBounceRepository: Repository<EmailBounce>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private emailTemplateSeeder: EmailTemplateSeeder,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<boolean> {
    try {
      const { to, template_type, template_variables, user_id } = sendEmailDto;

      // Check if email is bounced
      const isBounced = await this.isEmailBounced(to);
      if (isBounced) {
        this.logger.warn(`Email ${to} is bounced, skipping send`);
        return false;
      }

      // Get template
      const template = await this.emailTemplateRepository.findOne({
        where: { type: template_type, is_active: true },
      });

      if (!template) {
        throw new Error(`Template ${template_type} not found or inactive`);
      }

      // Get user if user_id provided
      let user: User | null = null;
      if (user_id) {
        user = await this.userRepository.findOne({ where: { id: user_id } });
      }

      // Process template variables
      const subject = this.processTemplate(
        template.subject,
        template_variables,
      );
      const htmlBody = this.processTemplate(
        template.html_body,
        template_variables,
      );
      const textBody = template.text_body
        ? this.processTemplate(template.text_body, template_variables)
        : undefined;

      // Create email log entry
      const emailLog = this.emailLogRepository.create({
        user,
        to_email: to,
        subject,
        template_type,
        status: EMAIL_STATUS.PENDING,
      });
      await this.emailLogRepository.save(emailLog);

      // Send email
      const info = await this.transporter.sendMail({
        from: {
          name: this.configService.get<string>('EMAIL_FROM_NAME'),
          address: this.configService.get<string>('EMAIL_FROM'),
        },
        to,
        subject,
        html: htmlBody,
        text: textBody,
      });

      // Update email log with success
      emailLog.status = EMAIL_STATUS.SENT;
      emailLog.message_id = info.messageId;
      emailLog.sent_at = new Date();
      await this.emailLogRepository.save(emailLog);

      this.logger.log(
        `Email sent successfully to ${to} with message ID: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);

      // Update email log with failure if it exists
      const existingLog = await this.emailLogRepository.findOne({
        where: {
          to_email: sendEmailDto.to,
          template_type: sendEmailDto.template_type,
        },
        order: { created_at: 'DESC' },
      });

      if (existingLog) {
        existingLog.status = EMAIL_STATUS.FAILED;
        existingLog.error_message = error.message;
        await this.emailLogRepository.save(existingLog);
      }

      return false;
    }
  }

  private processTemplate(
    template: string,
    variables: Record<string, any> = {},
  ): string {
    let processed = template;

    // Replace template variables like {{variable_name}}
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, variables[key]);
    });

    return processed;
  }

  async isEmailBounced(email: string): Promise<boolean> {
    const bounce = await this.emailBounceRepository.findOne({
      where: { email },
    });
    return !!bounce;
  }

  async addBounce(
    email: string,
    bounceType: string = 'hard',
    reason?: string,
  ): Promise<void> {
    const existingBounce = await this.emailBounceRepository.findOne({
      where: { email },
    });

    if (existingBounce) {
      existingBounce.bounce_count += 1;
      existingBounce.bounced_at = new Date();
      existingBounce.bounce_reason = reason || existingBounce.bounce_reason;
      await this.emailBounceRepository.save(existingBounce);
    } else {
      const user = await this.userRepository.findOne({ where: { email } });
      const bounce = this.emailBounceRepository.create({
        email,
        user,
        bounce_type: bounceType,
        bounce_reason: reason,
        bounced_at: new Date(),
      });
      await this.emailBounceRepository.save(bounce);
    }
  }

  async getEmailLogs(userId?: string, limit: number = 100) {
    const query = this.emailLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.created_at', 'DESC')
      .limit(limit);

    if (userId) {
      query.andWhere('log.user_id = :userId', { userId });
    }

    return await query.getMany();
  }

  async createTemplate(
    templateData: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    const template = this.emailTemplateRepository.create(templateData);
    return await this.emailTemplateRepository.save(template);
  }

  async getTemplate(type: EMAIL_TEMPLATE_TYPE): Promise<EmailTemplate | null> {
    return await this.emailTemplateRepository.findOne({
      where: { type, is_active: true },
    });
  }

  async getAllTemplates(): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async updateTemplate(
    type: EMAIL_TEMPLATE_TYPE,
    updateData: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    await this.emailTemplateRepository.update({ type }, updateData);
    return await this.emailTemplateRepository.findOne({ where: { type } });
  }

  async initializeDefaultTemplates(): Promise<void> {
    await this.emailTemplateSeeder.seedTemplates();
  }
}
