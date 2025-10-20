import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/email-template.entity';

@Injectable()
export class EmailTemplateSeeder {
  private readonly logger = new Logger(EmailTemplateSeeder.name);

  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplateRepository: Repository<EmailTemplate>,
  ) {}

  async seedTemplates() {
    this.logger.log('Seeding email templates...');

    const templates = [
      {
        type: EMAIL_TEMPLATE_TYPE.WELCOME,
        subject: 'Welcome to Science Experts - Your Learning Journey Starts Here! 🧪',
        description: 'Welcome email sent to new users upon registration',
        html_body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Science Experts</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">Welcome to Science Experts!</h1>
        <p style="font-size: 18px; color: #7f8c8d; margin: 10px 0;">Your Gateway to Scientific Excellence</p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2980b9; margin-top: 0;">Hello {{name}}!</h2>
        <p>{{welcome_message}}</p>
        <p>You've just joined thousands of students who are mastering science through our comprehensive platform.</p>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: #2980b9;">What's waiting for you:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                📚 <strong>Comprehensive Study Materials</strong> - Access thousands of resources
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                🧪 <strong>Interactive Experiments</strong> - Learn through hands-on practice
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                📝 <strong>Practice Tests</strong> - Evaluate your progress with quizzes
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                👨‍🏫 <strong>Expert Tutors</strong> - Get guidance from experienced educators
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="https://shreeedu.co.in/" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Learning Now</a>
    </div>

    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
        <p>Need help? Contact us at <a href="mailto:scienceexperts06@gmail.com">scienceexperts06@gmail.com</a></p>
        <p>Science Experts Team</p>
    </div>
</body>
</html>`,
        text_body: `Welcome to Science Experts, {{name}}!

{{welcome_message}}

You've just joined thousands of students who are mastering science through our comprehensive platform.

What's waiting for you:
- Comprehensive Study Materials - Access thousands of resources
- Interactive Experiments - Learn through hands-on practice
- Practice Tests - Evaluate your progress with quizzes
- Expert Tutors - Get guidance from experienced educators

Start your learning journey today!

Need help? Contact us at scienceexperts06@gmail.com

Science Experts Team`,
      },
      {
        type: EMAIL_TEMPLATE_TYPE.RE_ENGAGEMENT,
        subject: 'We miss you! Continue your scientific journey 🔬',
        description: 'Re-engagement email for inactive users',
        html_body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>We Miss You - Science Experts</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e74c3c; margin: 0;">We Miss You, {{name}}! 💔</h1>
    </div>

    <div style="background: #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <p style="font-size: 18px; margin: 0;">Your last visit was {{last_login}}</p>
    </div>

    <div style="margin: 20px 0;">
        <p>{{comeback_message}}</p>
        <p>While you were away, we've added exciting new content and features:</p>

        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #dff0d8; border-radius: 4px;">
                ✨ <strong>New Interactive Labs</strong> - Experience virtual experiments
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #dff0d8; border-radius: 4px;">
                📖 <strong>Updated Study Guides</strong> - Fresh content for better learning
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #dff0d8; border-radius: 4px;">
                🏆 <strong>Achievement System</strong> - Track your progress with badges
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; color: #2c3e50;">Ready to dive back in?</p>
        <a href="https://shreeedu.co.in/" style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Continue Learning</a>
    </div>

    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
        <p>Science Experts Team</p>
    </div>
</body>
</html>`,
        text_body: `We Miss You, {{name}}!

Your last visit was {{last_login}}

{{comeback_message}}

While you were away, we've added exciting new content and features:
- New Interactive Labs - Experience virtual experiments
- Updated Study Guides - Fresh content for better learning
- Achievement System - Track your progress with badges

Ready to dive back in? Continue your learning journey today!

Science Experts Team`,
      },
      {
        type: EMAIL_TEMPLATE_TYPE.ENGAGEMENT_BOOST,
        subject: 'Weekly Science Boost: Tips to Excel in Your Studies 📈',
        description: 'Weekly engagement email for active users',
        html_body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Weekly Science Boost</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #27ae60; margin: 0;">Your Weekly Science Boost! 🚀</h1>
        <p style="font-size: 16px; color: #7f8c8d;">Keep the momentum going, {{name}}!</p>
    </div>

    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 18px; color: #27ae60; margin: 0; text-align: center;">{{engagement_message}}</p>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: #2980b9;">💡 This Week's Learning Tip:</h3>
        <div style="background: #f39c12; color: white; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-size: 16px;">{{weekly_tip}}</p>
        </div>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: #2980b9;">🎯 Recommended for You:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                📊 Review your progress in the dashboard
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                🧪 Try today's featured experiment
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px;">
                🤝 Join our community discussion forum
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="https://shreeedu.co.in/" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Explore Today</a>
    </div>

    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
        <p>Keep up the excellent work!</p>
        <p>Science Experts Team</p>
    </div>
</body>
</html>`,
        text_body: `Your Weekly Science Boost!

Keep the momentum going, {{name}}!

{{engagement_message}}

This Week's Learning Tip:
{{weekly_tip}}

Recommended for You:
- Review your progress in the dashboard
- Try today's featured experiment
- Join our community discussion forum

Keep up the excellent work!

Science Experts Team`,
      },
      {
        type: EMAIL_TEMPLATE_TYPE.CONVERSION_MOTIVATOR,
        subject: 'Unlock Premium Features - Take Your Learning Further! 🔓',
        description: 'Conversion email for active users without purchases',
        html_body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Unlock Your Full Potential</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8e44ad; margin: 0;">{{conversion_message}} 🚀</h1>
        <p style="font-size: 16px; color: #7f8c8d;">Hi {{name}}, you're doing amazing!</p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p>{{offer_details}}</p>
        <p>You've been actively learning with us, and we believe you're ready for the next level!</p>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: #8e44ad;">🌟 Premium Benefits Include:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
                <strong>🎯 Personalized Learning Path</strong><br>
                AI-powered recommendations based on your progress
            </li>
            <li style="margin: 10px 0; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 8px;">
                <strong>📚 Unlimited Resource Access</strong><br>
                All premium materials, books, and research papers
            </li>
            <li style="margin: 10px 0; padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 8px;">
                <strong>👨‍🏫 1-on-1 Tutor Sessions</strong><br>
                Direct access to expert educators
            </li>
            <li style="margin: 10px 0; padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border-radius: 8px;">
                <strong>🏆 Advanced Analytics</strong><br>
                Detailed insights into your learning progress
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; color: #2c3e50; margin-bottom: 20px;">Special offer for dedicated learners like you!</p>
        <a href="https://shreeedu.co.in/" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: bold;">Upgrade Now - 20% Off</a>
        <p style="font-size: 12px; color: #7f8c8d; margin-top: 10px;">Limited time offer - expires in 48 hours</p>
    </div>

    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
        <p>Questions? Reply to this email or contact support.</p>
        <p>Science Experts Team</p>
    </div>
</body>
</html>`,
        text_body: `{{conversion_message}}

Hi {{name}}, you're doing amazing!

{{offer_details}}

You've been actively learning with us, and we believe you're ready for the next level!

Premium Benefits Include:
- Personalized Learning Path - AI-powered recommendations
- Unlimited Resource Access - All premium materials and papers
- 1-on-1 Tutor Sessions - Direct access to expert educators
- Advanced Analytics - Detailed insights into your progress

Special offer for dedicated learners like you!
Upgrade Now - 20% Off (Limited time - expires in 48 hours)

Questions? Reply to this email or contact support.

Science Experts Team`,
      },
      {
        type: EMAIL_TEMPLATE_TYPE.RESOURCE_UPDATE,
        subject: 'New {{resource_type}} Available: {{resource_title}} 📚',
        description: 'Notification email for new resource updates',
        html_body: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Resource Available</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3498db; margin: 0;">New Learning Resource! 📚</h1>
        <p style="font-size: 16px; color: #7f8c8d;">Fresh content just added for you, {{name}}!</p>
    </div>

    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db;">
        <h2 style="color: #1976d2; margin-top: 0;">{{resource_type}}: {{resource_title}}</h2>
        <p style="font-size: 18px; color: #1565c0;">{{update_message}}</p>
    </div>

    <div style="margin: 20px 0;">
        <h3 style="color: #2980b9;">🎉 What's New:</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #f1f8ff; border-radius: 4px;">
                📄 <strong>High-Quality Content</strong> - Carefully curated by experts
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f1f8ff; border-radius: 4px;">
                🎯 <strong>Relevant to Your Studies</strong> - Aligned with your learning path
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #f1f8ff; border-radius: 4px;">
                📱 <strong>Multi-Format Access</strong> - Available on all your devices
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="https://shreeedu.co.in/" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Access New {{resource_type}}</a>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;"><strong>💡 Pro Tip:</strong> Set aside some time today to explore this new resource and enhance your understanding!</p>
    </div>

    <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
        <p>Happy Learning!</p>
        <p>Science Experts Team</p>
    </div>
</body>
</html>`,
        text_body: `New Learning Resource!

Fresh content just added for you, {{name}}!

{{resource_type}}: {{resource_title}}

{{update_message}}

What's New:
- High-Quality Content - Carefully curated by experts
- Relevant to Your Studies - Aligned with your learning path
- Multi-Format Access - Available on all your devices

Pro Tip: Set aside some time today to explore this new resource and enhance your understanding!

Happy Learning!

Science Experts Team`,
      },
    ];

    for (const templateData of templates) {
      const existingTemplate = await this.emailTemplateRepository.findOne({
        where: { type: templateData.type },
      });

      if (!existingTemplate) {
        const template = this.emailTemplateRepository.create(templateData);
        await this.emailTemplateRepository.save(template);
        this.logger.log(`Created template: ${templateData.type}`);
      } else {
        this.logger.log(`Template ${templateData.type} already exists, skipping...`);
      }
    }

    this.logger.log('Email template seeding completed');
  }
}