import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated';
import { getTenantId } from '../tenant-context/async-local-storage';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });

    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');

      // Add middleware to set RLS context for each query
      this.$use(async (params, next) => {
        const tenantId = getTenantId();

        if (tenantId) {
          // Set PostgreSQL session variable for RLS
          // This must be done before the query executes
          await this.$executeRawUnsafe(
            `SET LOCAL app.current_tenant_id = '${tenantId}'`
          );
        }

        return next(params);
      });
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Disconnected from database');
  }

  /**
   * Helper for seeding - disable RLS temporarily
   */
  async enableAllTables() {
    const tables = await this.$queryRaw<
      Array<{ tablename: string }>
    >`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT LIKE '_prisma_migrations'
    `;

    for (const table of tables) {
      await this.$executeRawUnsafe(
        `ALTER TABLE "${table.tablename}" DISABLE ROW LEVEL SECURITY`
      );
    }
  }

  /**
   * Re-enable RLS after seeding
   */
  async disableAllTables() {
    const tables = await this.$queryRaw<
      Array<{ tablename: string }>
    >`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT LIKE '_prisma_migrations'
    `;

    for (const table of tables) {
      await this.$executeRawUnsafe(
        `ALTER TABLE "${table.tablename}" ENABLE ROW LEVEL SECURITY`
      );
    }
  }
}
