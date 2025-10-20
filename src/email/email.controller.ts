import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { CreateTemplateDto } from './dto/create-template.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailAutomationService } from './email-automation.service';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailAutomationService: EmailAutomationService,
  ) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const success = await this.emailService.sendEmail(sendEmailDto);
    return { success, message: success ? 'Email sent successfully' : 'Failed to send email' };
  }

  @Post('template')
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    const template = await this.emailService.createTemplate(createTemplateDto);
    return { success: true, template };
  }

  @Get('templates')
  async getAllTemplates() {
    const templates = await this.emailService.getAllTemplates();
    return { success: true, templates };
  }

  @Get('template/:type')
  async getTemplate(@Param('type') type: EMAIL_TEMPLATE_TYPE) {
    const template = await this.emailService.getTemplate(type);
    return { success: true, template };
  }

  @Get('logs')
  async getEmailLogs(
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    const logs = await this.emailService.getEmailLogs(userId, limit ? parseInt(limit) : 100);
    return { success: true, logs };
  }

  @Post('trigger/welcome/:userId')
  async triggerWelcomeEmail(@Param('userId') userId: string) {
    const success = await this.emailAutomationService.triggerWelcomeEmail(userId);
    return { success, message: success ? 'Welcome email sent successfully' : 'Failed to send welcome email' };
  }

  @Post('trigger/resource-update')
  async triggerResourceUpdate(
    @Body() body: { resourceType: string; resourceTitle: string },
  ) {
    await this.emailAutomationService.sendResourceUpdateNotification(
      body.resourceType,
      body.resourceTitle,
    );
    return { success: true, message: 'Resource update notification sent' };
  }

  @Post('bounce')
  async addBounce(
    @Body() body: { email: string; bounceType?: string; reason?: string },
  ) {
    await this.emailService.addBounce(body.email, body.bounceType, body.reason);
    return { success: true, message: 'Bounce added successfully' };
  }

  @Get('bounce/:email')
  async checkBounce(@Param('email') email: string) {
    const isBounced = await this.emailService.isEmailBounced(email);
    return { success: true, isBounced };
  }

}