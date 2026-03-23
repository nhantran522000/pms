import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import HealthDigestTemplate, { HealthDigestTemplateProps } from './templates/health-digest.template';

/**
 * Health digest data for email
 */
export interface HealthDigest {
  userName: string;
  weekEnd: string;
  insights: string[];
  recommendations: string[];
  weekSummary: {
    weightEntries: number;
    workoutCount: number;
    avgSleepHours: number;
    loggingStreak: number;
  };
}

/**
 * Result of sending an email
 */
export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * EmailService handles email delivery via Resend
 * Implements retry logic with exponential backoff per CONTEXT.md
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly maxRetries = 3;
  private readonly baseDelayMs = 1000; // 1 second base delay

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured - email sending will fail');
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Send health digest email with retry logic
   * @param email - Recipient email address
   * @param digest - Health digest data
   * @param unsubscribeUrl - One-click unsubscribe URL
   * @returns SendResult indicating success or failure
   */
  async sendHealthDigest(
    email: string,
    digest: HealthDigest,
    unsubscribeUrl: string,
  ): Promise<SendResult> {
    this.logger.log(`Sending health digest to ${email}`);

    // Prepare template props
    const templateProps: HealthDigestTemplateProps = {
      userName: digest.userName,
      weekEnd: digest.weekEnd,
      insights: digest.insights,
      recommendations: digest.recommendations,
      weekSummary: digest.weekSummary,
      unsubscribeUrl,
    };

    // Render React Email template to HTML
    const html = await render(HealthDigestTemplate(templateProps));

    // Send with retry logic
    return this.sendWithRetry(email, digest.weekEnd, html, unsubscribeUrl);
  }

  /**
   * Send email with exponential backoff retry
   */
  private async sendWithRetry(
    email: string,
    weekEnd: string,
    html: string,
    unsubscribeUrl: string,
  ): Promise<SendResult> {
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'health@yourdomain.com';

        const { data, error } = await this.resend.emails.send({
          from: fromEmail,
          to: email,
          subject: `Your Weekly Health Digest - ${weekEnd}`,
          html,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        this.logger.log(`Health digest sent successfully to ${email} (messageId: ${data?.id})`);
        return {
          success: true,
          messageId: data?.id,
        };
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Unknown error';
        this.logger.warn(
          `Attempt ${attempt}/${this.maxRetries} failed for ${email}: ${lastError}`,
        );

        // Don't wait after the last attempt
        if (attempt < this.maxRetries) {
          const delay = this.baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
          this.logger.debug(`Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    this.logger.error(`Failed to send health digest to ${email} after ${this.maxRetries} attempts`);
    return {
      success: false,
      error: lastError,
    };
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
