import { Controller, Get, Query } from '@nestjs/common';
import { UsageLoggingService, UsageQueryOptions } from '@pms/shared-kernel';
import { Public } from '@pms/feature-auth';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly usageLogging: UsageLoggingService) {}

  /**
   * Get usage logs with optional filtering
   */
  @Get('usage')
  async getUsage(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('provider') provider?: string,
    @Query('taskType') taskType?: string,
    @Query('success') success?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options: UsageQueryOptions = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      provider: provider as any,
      taskType: taskType as any,
      success: success === 'true' ? true : success === 'false' ? false : undefined,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    };

    const logs = await this.usageLogging.query(options);
    return { success: true, data: logs };
  }

  /**
   * Get aggregated statistics
   */
  @Get('usage/stats')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const stats = await this.usageLogging.getStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return { success: true, data: stats };
  }

  /**
   * Get daily usage for charts
   */
  @Get('usage/daily')
  async getDailyUsage(@Query('days') days?: string) {
    const dayCount = days ? parseInt(days, 10) : 30;
    const daily = await this.usageLogging.getDailyUsage(dayCount);
    return { success: true, data: daily };
  }

  /**
   * Get current token budget status
   */
  @Get('budget')
  async getBudget() {
    // This would use TokenBudgetService - for now return placeholder
    return {
      success: true,
      data: {
        message: 'Budget endpoint - requires TokenBudgetService injection',
      },
    };
  }
}
