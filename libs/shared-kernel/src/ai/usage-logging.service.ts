import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { getTenantId } from '@pms/data-access';
import { AiProvider, AiTaskType } from '@pms/shared-types';

export interface UsageLogEntry {
  id: string;
  provider: AiProvider;
  model: string;
  taskType: AiTaskType;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

export interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  avgLatencyMs: number;
  byProvider: Record<AiProvider, { requests: number; tokens: number }>;
  byTaskType: Record<string, { requests: number; tokens: number }>;
}

export interface UsageQueryOptions {
  startDate?: Date;
  endDate?: Date;
  provider?: AiProvider;
  taskType?: AiTaskType;
  success?: boolean;
  limit?: number;
  offset?: number;
}

@Injectable()
export class UsageLoggingService {
  private readonly logger = new Logger(UsageLoggingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an AI usage event
   * Note: This is typically called by AiGatewayService after each request
   */
  async log(entry: Omit<UsageLogEntry, 'id' | 'createdAt'>): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      this.logger.warn('No tenant context for usage logging');
      return;
    }

    try {
      await this.prisma.aiUsageLog.create({
        data: {
          tenantId,
          provider: entry.provider,
          model: entry.model,
          taskType: entry.taskType,
          inputTokens: entry.inputTokens,
          outputTokens: entry.outputTokens,
          latencyMs: entry.latencyMs,
          success: entry.success,
          errorMessage: entry.errorMessage,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log usage: ${error}`);
    }
  }

  /**
   * Query usage logs with filtering
   */
  async query(options: UsageQueryOptions = {}): Promise<UsageLogEntry[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      return [];
    }

    const where: any = { tenantId };

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) where.createdAt.gte = options.startDate;
      if (options.endDate) where.createdAt.lte = options.endDate;
    }

    if (options.provider) where.provider = options.provider;
    if (options.taskType) where.taskType = options.taskType;
    if (options.success !== undefined) where.success = options.success;

    const logs = await this.prisma.aiUsageLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 100,
      skip: options.offset || 0,
    });

    return logs.map(log => ({
      id: log.id,
      provider: log.provider as AiProvider,
      model: log.model,
      taskType: log.taskType as AiTaskType,
      inputTokens: log.inputTokens,
      outputTokens: log.outputTokens,
      latencyMs: log.latencyMs,
      success: log.success,
      errorMessage: log.errorMessage || undefined,
      createdAt: log.createdAt,
    }));
  }

  /**
   * Get aggregated statistics for a date range
   */
  async getStats(startDate?: Date, endDate?: Date): Promise<UsageStats> {
    const tenantId = getTenantId();
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days
    const end = endDate || new Date();

    const logs = await this.prisma.aiUsageLog.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Calculate aggregates
    const totalRequests = logs.length;
    const successfulRequests = logs.filter(l => l.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const totalInputTokens = logs.reduce((sum, l) => sum + l.inputTokens, 0);
    const totalOutputTokens = logs.reduce((sum, l) => sum + l.outputTokens, 0);
    const avgLatencyMs = totalRequests > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / totalRequests)
      : 0;

    // Group by provider
    const byProvider: Record<string, { requests: number; tokens: number }> = {};
    for (const log of logs) {
      if (!byProvider[log.provider]) {
        byProvider[log.provider] = { requests: 0, tokens: 0 };
      }
      byProvider[log.provider].requests++;
      byProvider[log.provider].tokens += log.inputTokens + log.outputTokens;
    }

    // Group by task type
    const byTaskType: Record<string, { requests: number; tokens: number }> = {};
    for (const log of logs) {
      if (!byTaskType[log.taskType]) {
        byTaskType[log.taskType] = { requests: 0, tokens: 0 };
      }
      byTaskType[log.taskType].requests++;
      byTaskType[log.taskType].tokens += log.inputTokens + log.outputTokens;
    }

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      totalInputTokens,
      totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
      avgLatencyMs,
      byProvider: byProvider as Record<AiProvider, { requests: number; tokens: number }>,
      byTaskType,
    };
  }

  /**
   * Get daily usage breakdown for charts
   */
  async getDailyUsage(days: number = 30): Promise<Array<{ date: string; requests: number; tokens: number }>> {
    const tenantId = getTenantId();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const logs = await this.prisma.aiUsageLog.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        inputTokens: true,
        outputTokens: true,
      },
    });

    // Group by date
    const byDate: Record<string, { requests: number; tokens: number }> = {};

    // Initialize all dates
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      byDate[dateKey] = { requests: 0, tokens: 0 };
    }

    // Fill in actual data
    for (const log of logs) {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      if (byDate[dateKey]) {
        byDate[dateKey].requests++;
        byDate[dateKey].tokens += log.inputTokens + log.outputTokens;
      }
    }

    // Convert to array sorted by date
    return Object.entries(byDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Clean up old logs (for data retention policy)
   */
  async cleanupOldLogs(olderThanDays: number = 90): Promise<number> {
    const tenantId = getTenantId();
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

    const result = await this.prisma.aiUsageLog.deleteMany({
      where: {
        tenantId,
        createdAt: { lt: cutoffDate },
      },
    });

    this.logger.log(`Cleaned up ${result.count} usage logs older than ${olderThanDays} days`);
    return result.count;
  }
}
