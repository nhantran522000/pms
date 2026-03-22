import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { getTenantId } from '@pms/data-access';

export interface TokenBudgetConfig {
  // Default monthly token quota per tenant (can be overridden per tenant)
  defaultMonthlyQuota: number;
  // Alert threshold as percentage (0-100)
  alertThresholdPercent: number;
}

export interface TokenUsage {
  used: number;
  quota: number;
  percentUsed: number;
  isOverBudget: boolean;
}

@Injectable()
export class TokenBudgetService {
  private readonly logger = new Logger(TokenBudgetService.name);

  // Default: 100,000 tokens per month per tenant (~$1-2 worth at typical rates)
  private readonly config: TokenBudgetConfig = {
    defaultMonthlyQuota: 100_000,
    alertThresholdPercent: 80,
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if tenant has remaining token budget
   */
  async hasBudget(tokensNeeded: number): Promise<boolean> {
    const usage = await this.getCurrentUsage();
    return !usage.isOverBudget && usage.used + tokensNeeded <= usage.quota;
  }

  /**
   * Get current token usage for tenant this month
   */
  async getCurrentUsage(): Promise<TokenUsage> {
    const tenantId = getTenantId();
    if (!tenantId) {
      this.logger.warn('No tenant context for budget check');
      return {
        used: 0,
        quota: this.config.defaultMonthlyQuota,
        percentUsed: 0,
        isOverBudget: false,
      };
    }

    // Get start of current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
      // Sum all tokens used this month
      const result = await this.prisma.aiUsageLog.aggregate({
        where: {
          tenantId,
          createdAt: { gte: monthStart },
        },
        _sum: {
          inputTokens: true,
          outputTokens: true,
        },
      });

      const used = (result._sum.inputTokens || 0) + (result._sum.outputTokens || 0);
      const quota = this.config.defaultMonthlyQuota;
      const percentUsed = Math.round((used / quota) * 100);
      const isOverBudget = used >= quota;

      // Log alert if at threshold
      if (percentUsed >= this.config.alertThresholdPercent && percentUsed < 100) {
        this.logger.warn(
          `Tenant ${tenantId} at ${percentUsed}% token budget (${used}/${quota} tokens)`
        );
      }

      return {
        used,
        quota,
        percentUsed,
        isOverBudget,
      };
    } catch (error) {
      this.logger.error(`Failed to get token usage: ${error}`);
      return {
        used: 0,
        quota: this.config.defaultMonthlyQuota,
        percentUsed: 0,
        isOverBudget: false,
      };
    }
  }

  /**
   * Record token usage (called after successful AI call)
   */
  async recordUsage(inputTokens: number, outputTokens: number): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      this.logger.warn('No tenant context for usage recording');
      return;
    }

    // Note: Actual logging to AiUsageLog is done by AiGatewayService
    // This method can be used for real-time budget tracking if needed
    this.logger.debug(
      `Recorded token usage for tenant ${tenantId}: ${inputTokens} input + ${outputTokens} output`
    );
  }

  /**
   * Get budget configuration
   */
  getConfig(): TokenBudgetConfig {
    return { ...this.config };
  }

  /**
   * Check and alert if approaching budget limit
   */
  async checkAndAlert(): Promise<{ shouldAlert: boolean; usage: TokenUsage }> {
    const usage = await this.getCurrentUsage();
    const shouldAlert = usage.percentUsed >= this.config.alertThresholdPercent;

    if (shouldAlert && !usage.isOverBudget) {
      this.logger.warn(
        `TOKEN BUDGET ALERT: Tenant at ${usage.percentUsed}% of monthly quota (${usage.used}/${usage.quota} tokens)`
      );
    }

    return { shouldAlert, usage };
  }
}
