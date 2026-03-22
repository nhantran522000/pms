import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured - emails will be logged only');
      this.resend = null as unknown as Resend;
    } else {
      this.resend = new Resend(apiKey);
    }

    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@pms.local');
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    if (!this.resend) {
      this.logger.log(`[EMAIL MOCK] Verification email to ${email}`);
      this.logger.log(`[EMAIL MOCK] Verify URL: ${verifyUrl}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Verify your email address',
        html: `
          <h1>Welcome to PMS!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}: ${error.message}`);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    if (!this.resend) {
      this.logger.log(`[EMAIL MOCK] Password reset email to ${email}`);
      this.logger.log(`[EMAIL MOCK] Reset URL: ${resetUrl}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Reset your password',
        html: `
          <h1>Reset your password</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
      throw new Error('Failed to send password reset email');
    }
  }
}
