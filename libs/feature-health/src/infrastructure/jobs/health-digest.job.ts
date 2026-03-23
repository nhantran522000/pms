import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgBoss, Job } from 'pg-boss';
import { PrismaService } from '@pms/data-access';
import { HealthDigestService } from '../../application/services/health-digest.service';
import { HealthLogRepository } from '../repositories/health-log.repository';
import { EmailService, HealthDigest as EmailHealthDigest } from '../email/email.service';

export const HEALTH_DIGEST_JOB = 'health-digest-generate';
const SUNDAY_CRON = '0 9 * * 0'; // Every Sunday at 9 AM

export interface HealthDigestJobData {
  tenantId: string;
  userId?: string;
  userName: string;
  triggered?: boolean;
  triggeredAt?: string;
}

export interface DigestResult {
  tenantId: string;
  success: boolean;
  digestId?: string;
  emailSent?: boolean;
  error?: string;
}

@Injectable()
export class HealthDigestJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HealthDigestJob.name);
  private boss: PgBoss | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly healthDigestService: HealthDigestService,
    private readonly healthLogRepository: HealthLogRepository,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      this.logger.warn('DATABASE_URL not configured, skipping pg-boss initialization');
      return;
    }

    try {
      // Initialize pg-boss with the database URL
      this.boss = new PgBoss({
        connectionString: databaseUrl,
        schema: 'pgboss',
      });

      // Handle pg-boss events
      this.boss.on('error', (error: Error) => {
        this.logger.error(`pg-boss error: ${error.message}`);
      });

      this.boss.on('monitor-states', (states: Record<string, number>) => {
        this.logger.debug(`pg-boss states: ${JSON.stringify(states)}`);
      });

      // Start pg-boss
      await this.boss.start();
      this.logger.log('pg-boss started successfully for health digest');

      // Register the job handler
      await this.boss.work(HEALTH_DIGEST_JOB, async (job: Job<HealthDigestJobData>) => {
        this.logger.log(`Processing health digest job: ${job.id}`);
        return this.handleJob(job);
      });

      // Schedule the job to run every Sunday at 9 AM
      await this.boss.schedule(HEALTH_DIGEST_JOB, SUNDAY_CRON);
      this.logger.log(`Scheduled ${HEALTH_DIGEST_JOB} to run every Sunday at 9 AM (${SUNDAY_CRON})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to initialize pg-boss: ${errorMessage}`);
      // Don't throw - allow the app to continue without the scheduler
    }
  }

  async onModuleDestroy() {
    if (this.boss) {
      try {
        await this.boss.stop();
        this.logger.log('pg-boss stopped for health digest');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error stopping pg-boss: ${errorMessage}`);
      }
    }
  }

  /**
   * Handle the health digest generation job
   * Gets all tenants with health data and generates digests for each
   */
  private async handleJob(job: Job<HealthDigestJobData>): Promise<DigestResult[]> {
    this.logger.log('Starting health digest generation');

    try {
      // If job data includes specific tenant, process just that one
      if (job.data?.tenantId && job.data?.userName) {
        const result = await this.generateDigestForTenant(
          job.data.tenantId,
          job.data.userName,
        );
        return [result];
      }

      // Otherwise, get all tenants with health data this week
      const tenantsWithHealthData = await this.getTenantsWithHealthData();

      if (tenantsWithHealthData.length === 0) {
        this.logger.log('No tenants with health data found for digest generation');
        return [];
      }

      // Generate digests for all tenants
      const results = await Promise.all(
        tenantsWithHealthData.map(async ({ tenantId, userName }) =>
          this.generateDigestForTenant(tenantId, userName),
        ),
      );

      const succeeded = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      this.logger.log(
        `Health digest generation complete: ${succeeded} succeeded, ${failed} failed`,
      );

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Health digest generation failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Generate a digest for a specific tenant and send via email
   */
  private async generateDigestForTenant(
    tenantId: string,
    userName: string,
  ): Promise<DigestResult> {
    try {
      this.logger.debug(`Generating digest for tenant ${tenantId}`);

      const digest = await this.healthDigestService.generateDigest(tenantId, userName);

      this.logger.log(
        `Digest generated for tenant ${tenantId} (data-only: ${digest.isDataOnly})`,
      );

      // Get user email for sending
      const userEmail = await this.getUserEmail(tenantId);
      if (!userEmail) {
        this.logger.warn(`No email found for tenant ${tenantId}, skipping email send`);
        return {
          tenantId,
          success: true,
          digestId: `${tenantId}-${Date.now()}`,
          emailSent: false,
        };
      }

      // Generate unsubscribe URL
      const unsubscribeUrl = this.generateUnsubscribeUrl(tenantId);

      // Prepare email digest data
      const emailDigest: EmailHealthDigest = {
        userName,
        weekEnd: this.getWeekBounds().weekEnd.toLocaleDateString(),
        insights: [...digest.trends, ...digest.correlations],
        recommendations: digest.recommendations,
        weekSummary: {
          weightEntries: 0,
          workoutCount: 0,
          avgSleepHours: 0,
          loggingStreak: 0,
        },
      };

      // Send email via EmailService
      const sendResult = await this.emailService.sendHealthDigest(
        userEmail,
        emailDigest,
        unsubscribeUrl,
      );

      if (!sendResult.success) {
        this.logger.warn(`Failed to send digest email to ${userEmail}: ${sendResult.error}`);
      } else {
        this.logger.log(`Digest email sent to ${userEmail} (messageId: ${sendResult.messageId})`);
      }

      return {
        tenantId,
        success: true,
        digestId: `${tenantId}-${Date.now()}`,
        emailSent: sendResult.success,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to generate digest for tenant ${tenantId}: ${errorMessage}`);
      return {
        tenantId,
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all tenants that have health data logged in the current week
   * Returns tenant IDs with their user names for personalization
   */
  private async getTenantsWithHealthData(): Promise<
    Array<{ tenantId: string; userName: string }>
  > {
    // Get week bounds
    const { weekStart, weekEnd } = this.getWeekBounds();

    this.logger.debug(
      `Looking for tenants with health data between ${weekStart.toISOString()} and ${weekEnd.toISOString()}`,
    );

    // Query distinct tenants with health logs in the current week
    // Join with users to get the user name for personalization
    const tenantsWithHealthData = await this.prisma.healthLog.findMany({
      where: {
        loggedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        deletedAt: null,
      },
      select: {
        tenantId: true,
        tenant: {
          select: {
            users: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      distinct: ['tenantId'],
    });

    // Map to tenant info with user names
    return tenantsWithHealthData
      .map((log) => {
        const user = log.tenant.users[0]; // Assume single user per tenant for v1
        return {
          tenantId: log.tenantId,
          userName: user?.name || 'User',
        };
      })
      .filter((item, index, self) =>
        // Ensure unique tenantIds
        index === self.findIndex((t) => t.tenantId === item.tenantId)
      );
  }

  /**
   * Get user email from tenant ID
   * Assumes single user per tenant for v1
   */
  private async getUserEmail(tenantId: string): Promise<string | null> {
    const user = await this.prisma.user.findFirst({
      where: { tenantId },
      select: { email: true },
    });

    return user?.email ?? null;
  }

  /**
   * Generate unsubscribe URL for the tenant
   * In production, this would include a signed token for verification
   */
  private generateUnsubscribeUrl(tenantId: string): string {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
    // In production, this should include a signed JWT token for verification
    // For now, we use a simple token format
    return `${frontendUrl}/settings/notifications/unsubscribe?token=${Buffer.from(tenantId).toString('base64')}&type=health-digest`;
  }

  /**
   * Get the start and end dates for the current week (Sunday to Saturday)
   */
  private getWeekBounds(): { weekStart: Date; weekEnd: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Calculate start of week (Sunday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    // Calculate end of week (Saturday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  }

  /**
   * Manually trigger digest generation for a specific tenant (for testing)
   */
  async triggerDigestManually(
    tenantId: string,
    userName: string,
  ): Promise<string | null> {
    if (!this.boss) {
      throw new Error('pg-boss not initialized');
    }

    const jobId = await this.boss.send(HEALTH_DIGEST_JOB, {
      tenantId,
      userName,
      triggered: true,
      triggeredAt: new Date().toISOString(),
    } as HealthDigestJobData);

    this.logger.log(`Triggered manual digest generation for tenant ${tenantId}, job ID: ${jobId}`);
    return jobId;
  }

  /**
   * Get the current schedule status
   */
  async getScheduleStatus(): Promise<{ scheduled: boolean; nextRun: Date | null }> {
    if (!this.boss) {
      return { scheduled: false, nextRun: null };
    }

    try {
      const schedules = await this.boss.getSchedules(HEALTH_DIGEST_JOB);
      if (schedules && schedules.length > 0) {
        return {
          scheduled: true,
          nextRun: schedules[0].nextRun,
        };
      }
    } catch (error) {
      this.logger.warn(`Failed to get schedule status: ${error}`);
    }

    return { scheduled: false, nextRun: null };
  }
}
