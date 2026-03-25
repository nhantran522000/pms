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
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send verification email to ${email}: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send password reset email to ${email}: ${errorMessage}`);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendTrialWarningEmail(
    email: string,
    name: string | null,
    trialEndDate: Date,
    daysRemaining: number,
  ): Promise<void> {
    const upgradeUrl = `${this.frontendUrl}/settings/subscription?upgrade=trial`;
    const trialEndDateFormatted = trialEndDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!this.resend) {
      this.logger.log(`[EMAIL MOCK] Trial warning email to ${email}`);
      this.logger.log(`[EMAIL MOCK] Subject: Your PMS trial expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`);
      this.logger.log(`[EMAIL MOCK] Trial end date: ${trialEndDateFormatted}`);
      this.logger.log(`[EMAIL MOCK] Upgrade URL: ${upgradeUrl}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Your PMS trial expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
        html: `
          <h1>Your Trial is Ending Soon</h1>
          <p>Hi ${name || 'there'},</p>
          <p>Your PMS trial will expire on <strong>${trialEndDateFormatted}</strong> (${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining).</p>
          <p>To continue enjoying all features, please upgrade to a PRO subscription before your trial ends.</p>
          <p><a href="${upgradeUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Upgrade Now</a></p>
          <h3>What happens when your trial ends?</h3>
          <ul>
            <li>You'll be downgraded to the FREE tier</li>
            <li>Advanced AI insights will be restricted</li>
            <li>You'll still have read-only access to your data</li>
          </ul>
          <p>If you have any questions, please don't hesitate to reach out.</p>
        `,
      });

      this.logger.log(`Trial warning email sent to ${email}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send trial warning email to ${email}: ${errorMessage}`);
      throw new Error('Failed to send trial warning email');
    }
  }
}
