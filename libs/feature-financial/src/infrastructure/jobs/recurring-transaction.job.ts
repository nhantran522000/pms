import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PgBoss, Job } from 'pg-boss';
import { RecurringTransactionService } from '../../application/services/recurring-transaction.service';

export const RECURRING_TRANSACTION_JOB = 'recurring-transaction-process';
const HOURLY_CRON = '0 * * * *';

@Injectable()
export class RecurringTransactionJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RecurringTransactionJob.name);
  private boss: PgBoss | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly recurringTransactionService: RecurringTransactionService,
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
      this.logger.log('pg-boss started successfully');

      // Register the job handler
      await this.boss.work(RECURRING_TRANSACTION_JOB, async (job: Job) => {
        this.logger.log(`Processing job: ${job.id}`);
        return this.handleJob(job);
      });

      // Schedule the job to run hourly
      await this.boss.schedule(RECURRING_TRANSACTION_JOB, HOURLY_CRON);
      this.logger.log(`Scheduled ${RECURRING_TRANSACTION_JOB} to run hourly (${HOURLY_CRON})`);
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
        this.logger.log('pg-boss stopped');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error stopping pg-boss: ${errorMessage}`);
      }
    }
  }

  /**
   * Handle the recurring transaction processing job
   */
  private async handleJob(job: Job): Promise<void> {
    this.logger.log('Starting recurring transaction processing');

    try {
      const result = await this.recurringTransactionService.processAllDue();

      this.logger.log(
        `Recurring transaction processing complete: ${result.succeeded} succeeded, ${result.failed} failed out of ${result.processed} total`,
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Recurring transaction processing failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Manually trigger processing (for testing or admin purposes)
   */
  async triggerProcessing(): Promise<void> {
    if (!this.boss) {
      throw new Error('pg-boss not initialized');
    }

    await this.boss.send(RECURRING_TRANSACTION_JOB, { triggered: true, at: new Date().toISOString() });
    this.logger.log('Triggered manual recurring transaction processing');
  }
}
