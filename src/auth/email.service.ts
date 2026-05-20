import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';
import * as tls from 'tls';

type SmtpSocket = net.Socket | tls.TLSSocket;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured() {
    return Boolean(
      this.configService.get<string>('SMTP_HOST') &&
        this.configService.get<string>('SMTP_USER') &&
        this.configService.get<string>('SMTP_PASS'),
    );
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    if (!this.isConfigured()) {
      this.logger.warn('SMTP is not configured. Password reset email was not sent.');
      return;
    }

    const appName = this.configService.get<string>('APP_NAME') || 'Science Experts';
    const from = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER');
    const subject = `${appName} password reset`;
    const text = [
      `We received a request to reset your ${appName} password.`,
      '',
      `Open this link to set a new password: ${resetUrl}`,
      '',
      'This link expires in 1 hour. If you did not request this, you can ignore this email.',
    ].join('\n');
    const html = `
      <p>We received a request to reset your ${appName} password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
    `;

    await this.sendMail({ to: email, from, subject, text, html });
  }

  private async sendMail({
    to,
    from,
    subject,
    text,
    html,
  }: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const serverName = this.configService.get<string>('SMTP_SERVER_NAME') || host;

    let socket: SmtpSocket;

    try {
      socket = secure
        ? tls.connect(port, host, { servername: serverName })
        : net.connect(port, host);

      await this.expect(socket, 220);
      await this.command(socket, `EHLO ${serverName}`, 250);

      if (!secure) {
        await this.command(socket, 'STARTTLS', 220);
        socket = tls.connect({ socket, servername: serverName });
        await this.command(socket, `EHLO ${serverName}`, 250);
      }

      await this.command(socket, 'AUTH LOGIN', 334);
      await this.command(socket, Buffer.from(user).toString('base64'), 334);
      await this.command(socket, Buffer.from(pass).toString('base64'), 235);
      await this.command(socket, `MAIL FROM:<${this.extractEmailAddress(from)}>`, 250);
      await this.command(socket, `RCPT TO:<${to}>`, 250);
      await this.command(socket, 'DATA', 354);
      await this.command(socket, `${this.buildMessage({ to, from, subject, text, html })}\r\n.`, 250);
      await this.command(socket, 'QUIT', 221);
    } catch (error) {
      this.logger.error('Failed to send email', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Unable to send password reset email');
    } finally {
      socket?.end();
    }
  }

  private buildMessage({
    to,
    from,
    subject,
    text,
    html,
  }: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const boundary = `science-experts-${Date.now()}`;
    return [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      text,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      '',
      html,
      '',
      `--${boundary}--`,
    ].join('\r\n');
  }

  private extractEmailAddress(value: string) {
    const match = value.match(/<([^>]+)>/);
    return match?.[1] || value;
  }

  private command(socket: SmtpSocket, command: string, expectedCode: number) {
    socket.write(`${command}\r\n`);
    return this.expect(socket, expectedCode);
  }

  private expect(socket: SmtpSocket, expectedCode: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let response = '';

      const onData = (chunk: Buffer) => {
        response += chunk.toString();
        const lines = response.trimEnd().split(/\r?\n/);
        const lastLine = lines[lines.length - 1];

        if (!/^\d{3} /.test(lastLine)) {
          return;
        }

        cleanup();
        const code = Number(lastLine.slice(0, 3));
        if (code === expectedCode) {
          resolve(response);
          return;
        }
        reject(new Error(`SMTP expected ${expectedCode}, received ${response}`));
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        socket.off('data', onData);
        socket.off('error', onError);
      };

      socket.on('data', onData);
      socket.on('error', onError);
    });
  }
}
