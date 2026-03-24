import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgBoss, Job } from 'pg-boss';
import { TrialWarningService, TRIAL_WARNING_JOB, TrialWarningJobData } from '../../application/services/trial-warning.service';

@Injectable()
export class TrialWarningJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TrialWarningJob.name);
  private boss: PgBoss | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly trialWarningService: TrialWarningService,
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
      this.logger.log('pg-boss started successfully for trial warnings');

      // Register the job handler
      await this.boss.work(TRIAL_WARNING_JOB, async (job: Job<TrialWarningJobData>) => {
        this.logger.log(`Processing trial warning job: ${job.id}`);
        return this.handleJob(job);
      });

      this.logger.log(`Registered handler for ${TRIAL_WARNING_JOB} job`);
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
        this.logger.log('pg-boss stopped for trial warnings');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error stopping pg-boss: ${errorMessage}`);
      }
    }
  }

  /**
   * Handle the trial warning email job
   */
  private async handleJob(job: Job<TrialWarningJobData>): Promise<void> {
    const { tenantId, trialEndDate } = job.data;

    this.logger.log(
      `Processing trial warning for tenant ${tenantId}, trial ends ${trialEndDate}`,
    );

    try {
      await this.trialWarningService.sendTrialWarningEmail(
        tenantId,
        new Date(trialEndDate),
      );

      this.logger.log(`Trial warning email sent successfully to tenant ${tenantId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send trial warning email: ${errorMessage}`);
      throw error; // Re-throw to trigger pg-boss retry
    }
  }
}
