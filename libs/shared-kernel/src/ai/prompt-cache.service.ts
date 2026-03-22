import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '@pms/data-access';
import { getTenantId } from '@pms/data-access';
import { AiResponse, AiTaskType } from '@pms/shared-types';

@Injectable()
export class PromptCacheService {
  private readonly logger = new Logger(PromptCacheService.name);
  private readonly CACHE_TTL_HOURS = 24;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a cache key from prompt and task type
   * Uses SHA-256 hash of normalized prompt
   */
  generateCacheKey(prompt: string, taskType: AiTaskType): string {
    // Normalize prompt: trim, lowercase, collapse whitespace
    const normalized = prompt.trim().toLowerCase().replace(/\s+/g, ' ');
    const hash = createHash('sha256').update(`${taskType}:${normalized}`).digest('hex');
    return hash;
  }

  /**
   * Get cached response if exists and not expired
   */
  async get(prompt: string, taskType: AiTaskType): Promise<AiResponse | null> {
    const tenantId = getTenantId();
    if (!tenantId) {
      this.logger.warn('No tenant context for cache lookup');
      return null;
    }

    const promptHash = this.generateCacheKey(prompt, taskType);
    const now = new Date();

    try {
      const cached = await this.prisma.aiPromptCache.findUnique({
        where: {
          tenantId_promptHash: {
            tenantId,
            promptHash,
          },
        },
      });

      if (!cached) {
        this.logger.debug(`Cache miss for task ${taskType}`);
        return null;
      }

      // Check expiration
      if (cached.expiresAt < now) {
        this.logger.debug(`Cache expired for task ${taskType}`);
        // Clean up expired entry
        await this.prisma.aiPromptCache.delete({
          where: { id: cached.id },
        });
        return null;
      }

      this.logger.debug(`Cache hit for task ${taskType}`);

      // Return cached response
      const response = cached.response as AiResponse;
      return {
        ...response,
        cached: true,
      };
    } catch (error) {
      this.logger.error(`Cache lookup failed: ${error}`);
      return null;
    }
  }

  /**
   * Store response in cache with 24h TTL
   */
  async set(prompt: string, taskType: AiTaskType, response: AiResponse): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      this.logger.warn('No tenant context for cache storage');
      return;
    }

    const promptHash = this.generateCacheKey(prompt, taskType);
    const expiresAt = new Date(Date.now() + this.CACHE_TTL_HOURS * 60 * 60 * 1000);

    try {
      await this.prisma.aiPromptCache.upsert({
        where: {
          tenantId_promptHash: {
            tenantId,
            promptHash,
          },
        },
        update: {
          response: response as any,
          tokensUsed: response.inputTokens + response.outputTokens,
          expiresAt,
        },
        create: {
          tenantId,
          promptHash,
          taskType,
          response: response as any,
          tokensUsed: response.inputTokens + response.outputTokens,
          expiresAt,
        },
      });

      this.logger.debug(`Cached response for task ${taskType}, expires at ${expiresAt.toISOString()}`);
    } catch (error) {
      this.logger.error(`Cache storage failed: ${error}`);
    }
  }

  /**
   * Clean up expired cache entries (can be called by cron job)
   */
  async cleanupExpired(): Promise<number> {
    const now = new Date();
    try {
      const result = await this.prisma.aiPromptCache.deleteMany({
        where: {
          expiresAt: { lt: now },
        },
      });
      this.logger.log(`Cleaned up ${result.count} expired cache entries`);
      return result.count;
    } catch (error) {
      this.logger.error(`Cache cleanup failed: ${error}`);
      return 0;
    }
  }

  /**
   * Get cache statistics for tenant
   */
  async getStats(): Promise<{ entries: number; totalTokens: number }> {
    const tenantId = getTenantId();
    if (!tenantId) {
      return { entries: 0, totalTokens: 0 };
    }

    const now = new Date();
    const entries = await this.prisma.aiPromptCache.count({
      where: {
        tenantId,
        expiresAt: { gte: now },
      },
    });

    const aggregated = await this.prisma.aiPromptCache.aggregate({
      where: {
        tenantId,
        expiresAt: { gte: now },
      },
      _sum: {
        tokensUsed: true,
      },
    });

    return {
      entries,
      totalTokens: aggregated._sum.tokensUsed || 0,
    };
  }
}
