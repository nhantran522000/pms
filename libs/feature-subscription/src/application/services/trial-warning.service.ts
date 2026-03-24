import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgBoss } from 'pg-boss';
import { PrismaClient } from '@pms/data-access';
import { EmailService } from '@pms/feature-auth';

export const TRIAL_WARNING_JOB = 'trial-warning-email';

export interface TrialWarningJobData {
  tenantId: string;
  trialEndDate: string;
}

@Injectable()
export class TrialWarningService {
  private readonly logger = new Logger(TrialWarningService.name);
  private readonly frontendUrl: string;
  private boss: PgBoss | null = null;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  /**
   * Initialize pg-boss for scheduling trial warning emails
   * This should be called when the service is initialized
   */
  async initializePgBoss(): Promise<void> {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      this.logger.warn('DATABASE_URL not configured, skipping pg-boss initialization');
      return;
    }

    try {
      this.boss = new PgBoss({
        connectionString: databaseUrl,
        schema: 'pgboss',
      });

      this.boss.on('error', (error: Error) => {
        this.logger.error(`pg-boss error: ${error.message}`);
      });

      await this.boss.start();
      this.logger.log('pg-boss started successfully for trial warnings');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to initialize pg-boss: ${errorMessage}`);
    }
  }

  /**
   * Schedule a trial warning email for Day 27 at 9 AM UTC
   * @param tenantId The tenant ID
   * @param trialEndDate The date when the trial ends
   */
  async scheduleTrialWarning(tenantId: string, trialEndDate: Date): Promise<void> {
    if (!this.boss) {
      this.logger.warn('pg-boss not initialized, skipping trial warning scheduling');
      return;
    }

    // Calculate warning date: trialEndDate - 3 days (Day 27)
    const warningDate = new Date(trialEndDate);
    warningDate.setDate(warningDate.getDate() - 3); // Day 27
    warningDate.setHours(9, 0, 0, 0); // 9 AM UTC

    // Schedule job with pg-boss
    const jobId = await this.boss.send(
      TRIAL_WARNING_JOB,
      {
        tenantId,
        trialEndDate: trialEndDate.toISOString(),
      } as TrialWarningJobData,
      {
        startAfter: warningDate,
        tz: 'UTC',
      },
    );

    this.logger.log(
      `Scheduled trial warning email for tenant ${tenantId} at ${warningDate.toISOString()} (job ID: ${jobId})`,
    );
  }

  /**
   * Send trial warning email to the tenant's user
   * @param tenantId The tenant ID
   * @param trialEndDate The date when the trial ends
   */
  async sendTrialWarningEmail(tenantId: string, trialEndDate: Date): Promise<void> {
    this.logger.log(`Sending trial warning email to tenant ${tenantId}`);

    try {
      // Get tenant email from database (first user's email)
      const user = await this.prisma.user.findFirst({
        where: { tenantId },
        select: { email: true, name: true },
      });

      if (!user) {
        this.logger.warn(`No user found for tenant ${tenantId}, skipping trial warning email`);
        return;
      }

      // Calculate days remaining
      const now = new Date();
      const daysRemaining = Math.max(
        0,
        Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );

      // Send trial warning email via EmailService
      await this.emailService.sendTrialWarningEmail(
        user.email,
        user.name,
        trialEndDate,
        daysRemaining,
      );

      this.logger.log(`Trial warning email sent to ${user.email} for tenant ${tenantId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send trial warning email to tenant ${tenantId}: ${errorMessage}`);
      throw new Error('Failed to send trial warning email');
    }
  }

  /**
   * Cancel pending trial warning email if user upgrades early
   * @param tenantId The tenant ID
   */
  async cancelScheduledWarning(tenantId: string): Promise<void> {
    if (!this.boss) {
      return;
    }

    try {
      // Cancel all pending jobs for this tenant
      // Note: pg-boss doesn't have a built-in method to cancel jobs by data
      // This is a placeholder for future implementation if needed
      this.logger.log(`Canceling trial warning for tenant ${tenantId} (if any)`);
      // TODO: Implement job cancellation when upgrading from trial to paid
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to cancel trial warning: ${errorMessage}`);
    }
  }

  /**
   * Stop pg-boss when the service is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    if (this.boss) {
      try {
        await this.boss.stop();
        this.logger.log('pg-boss stopped for trial warnings');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error stopping pg-boss: ${errorMessage}`);
      }
    }
  }
}
