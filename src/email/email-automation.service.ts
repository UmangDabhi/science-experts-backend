import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from './email.service';
import { EmailLog } from './entities/email-log.entity';

@Injectable()
export class EmailAutomationService {
  private readonly logger = new Logger(EmailAutomationService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
    private emailService: EmailService,
  ) {}

  // Welcome email for new users - runs every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendWelcomeEmails() {
    try {
      this.logger.log('Starting welcome email campaign');

      // Get users who signed up in last 5 minutes and haven't received welcome email
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const newUsers = await this.userRepository.createQueryBuilder('user')
        .leftJoin('email_log', 'log', 'log.user_id = user.id AND log.template_type = :templateType', {
          templateType: EMAIL_TEMPLATE_TYPE.WELCOME
        })
        .where('user.created_at >= :fiveMinutesAgo', { fiveMinutesAgo })
        .andWhere('log.id IS NULL')
        .getMany();

      for (const user of newUsers) {
        const templateVariables = {
          name: user.name || 'Student',
          email: user.email,
          welcome_message: 'Welcome to Science Experts! We\'re excited to help you on your learning journey.',
        };

        await this.emailService.sendEmail({
          to: user.email,
          template_type: EMAIL_TEMPLATE_TYPE.WELCOME,
          template_variables: templateVariables,
          user_id: user.id,
        });
      }

      this.logger.log(`Sent welcome emails to ${newUsers.length} users`);
    } catch (error) {
      this.logger.error(`Welcome email campaign failed: ${error.message}`);
    }
  }

  // Re-engagement email for inactive users - runs daily at 9 AM
  @Cron('0 9 * * *')
  async sendReEngagementEmails() {
    try {
      this.logger.log('Starting re-engagement email campaign');

      // Get users who haven't logged in for 7 days but were active before
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Find users who haven't received re-engagement email in the last 7 days
      const inactiveUsers = await this.userRepository.createQueryBuilder('user')
        .leftJoin('email_log', 'recent_log',
          'recent_log.user_id = user.id AND recent_log.template_type = :templateType AND recent_log.created_at > :sevenDaysAgo',
          { templateType: EMAIL_TEMPLATE_TYPE.RE_ENGAGEMENT, sevenDaysAgo }
        )
        .where('user.updated_at < :sevenDaysAgo', { sevenDaysAgo })
        .andWhere('user.created_at < :thirtyDaysAgo', { thirtyDaysAgo }) // Exclude very new users
        .andWhere('recent_log.id IS NULL') // Haven't received re-engagement email recently
        .limit(50) // Limit batch size
        .getMany();

      for (const user of inactiveUsers) {
        const templateVariables = {
          name: user.name || 'Student',
          last_login: 'over a week ago',
          comeback_message: 'We miss you! Come back to continue your learning journey with new courses and materials.',
        };

        await this.emailService.sendEmail({
          to: user.email,
          template_type: EMAIL_TEMPLATE_TYPE.RE_ENGAGEMENT,
          template_variables: templateVariables,
          user_id: user.id,
        });
      }

      this.logger.log(`Sent re-engagement emails to ${inactiveUsers.length} users`);
    } catch (error) {
      this.logger.error(`Re-engagement email campaign failed: ${error.message}`);
    }
  }

  // Engagement boost for active users - runs weekly on Mondays at 10 AM
  @Cron('0 10 * * 1')
  async sendEngagementBoostEmails() {
    try {
      this.logger.log('Starting engagement boost email campaign');

      // Get users who have been active in the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const activeUsers = await this.userRepository.createQueryBuilder('user')
        .leftJoin('email_log', 'recent_log',
          'recent_log.user_id = user.id AND recent_log.template_type = :templateType AND recent_log.created_at > :sevenDaysAgo',
          { templateType: EMAIL_TEMPLATE_TYPE.ENGAGEMENT_BOOST, sevenDaysAgo }
        )
        .where('user.updated_at >= :sevenDaysAgo', { sevenDaysAgo })
        .andWhere('recent_log.id IS NULL')
        .limit(100)
        .getMany();

      for (const user of activeUsers) {
        const templateVariables = {
          name: user.name || 'Student',
          weekly_tip: 'Try our new quiz feature to test your knowledge!',
          engagement_message: 'Keep up the great work! Your consistent learning is paying off.',
        };

        await this.emailService.sendEmail({
          to: user.email,
          template_type: EMAIL_TEMPLATE_TYPE.ENGAGEMENT_BOOST,
          template_variables: templateVariables,
          user_id: user.id,
        });
      }

      this.logger.log(`Sent engagement boost emails to ${activeUsers.length} users`);
    } catch (error) {
      this.logger.error(`Engagement boost email campaign failed: ${error.message}`);
    }
  }

  // Conversion motivator for active users without purchases - runs twice weekly
  @Cron('0 14 * * 2,5')
  async sendConversionMotivatorEmails() {
    try {
      this.logger.log('Starting conversion motivator email campaign');

      // Get users who are active but haven't made any purchases
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const activeNonPurchasingUsers = await this.userRepository.createQueryBuilder('user')
        .leftJoin('user.enrollments', 'enrollment')
        .leftJoin('user.material_purchases', 'material_purchase')
        .leftJoin('user.book_purchases', 'book_purchase')
        .leftJoin('user.paper_purchases', 'paper_purchase')
        .leftJoin('email_log', 'recent_log',
          'recent_log.user_id = user.id AND recent_log.template_type = :templateType AND recent_log.created_at > :sevenDaysAgo',
          { templateType: EMAIL_TEMPLATE_TYPE.CONVERSION_MOTIVATOR, sevenDaysAgo }
        )
        .where('user.updated_at >= :sevenDaysAgo', { sevenDaysAgo })
        .andWhere('enrollment.id IS NULL')
        .andWhere('material_purchase.id IS NULL')
        .andWhere('book_purchase.id IS NULL')
        .andWhere('paper_purchase.id IS NULL')
        .andWhere('recent_log.id IS NULL')
        .limit(50)
        .getMany();

      for (const user of activeNonPurchasingUsers) {
        const templateVariables = {
          name: user.name || 'Student',
          conversion_message: 'Ready to take your learning to the next level?',
          offer_details: 'Explore our premium courses and materials designed just for students like you.',
        };

        await this.emailService.sendEmail({
          to: user.email,
          template_type: EMAIL_TEMPLATE_TYPE.CONVERSION_MOTIVATOR,
          template_variables: templateVariables,
          user_id: user.id,
        });
      }

      this.logger.log(`Sent conversion motivator emails to ${activeNonPurchasingUsers.length} users`);
    } catch (error) {
      this.logger.error(`Conversion motivator email campaign failed: ${error.message}`);
    }
  }

  // Manual trigger for resource update notifications
  async sendResourceUpdateNotification(resourceType: string, resourceTitle: string) {
    try {
      this.logger.log(`Starting resource update notification for ${resourceType}: ${resourceTitle}`);

      // Get all active users
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const activeUsers = await this.userRepository.createQueryBuilder('user')
        .where('user.updated_at >= :sevenDaysAgo', { sevenDaysAgo })
        .limit(200)
        .getMany();

      for (const user of activeUsers) {
        const templateVariables = {
          name: user.name || 'Student',
          resource_type: resourceType,
          resource_title: resourceTitle,
          update_message: `New ${resourceType.toLowerCase()} "${resourceTitle}" is now available!`,
        };

        await this.emailService.sendEmail({
          to: user.email,
          template_type: EMAIL_TEMPLATE_TYPE.RESOURCE_UPDATE,
          template_variables: templateVariables,
          user_id: user.id,
        });
      }

      this.logger.log(`Sent resource update emails to ${activeUsers.length} users`);
    } catch (error) {
      this.logger.error(`Resource update email campaign failed: ${error.message}`);
    }
  }

  // Method to trigger welcome email manually (for immediate signup)
  async triggerWelcomeEmail(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if welcome email already sent
      const existingWelcomeEmail = await this.emailLogRepository.findOne({
        where: {
          user: { id: userId },
          template_type: EMAIL_TEMPLATE_TYPE.WELCOME,
        },
      });

      if (existingWelcomeEmail) {
        this.logger.warn(`Welcome email already sent to user ${userId}`);
        return false;
      }

      const templateVariables = {
        name: user.name || 'Student',
        email: user.email,
        welcome_message: 'Welcome to Science Experts! We\'re excited to help you on your learning journey.',
      };

      const success = await this.emailService.sendEmail({
        to: user.email,
        template_type: EMAIL_TEMPLATE_TYPE.WELCOME,
        template_variables: templateVariables,
        user_id: user.id,
      });

      return success;
    } catch (error) {
      this.logger.error(`Failed to trigger welcome email for user ${userId}: ${error.message}`);
      return false;
    }
  }
}