import { Controller, Get, Param } from '@nestjs/common';
import { HobbyInsightsService } from '../../application/services/hobby-insights.service';
import type { HobbyInsights } from '@pms/shared-types';

/**
 * Hobby Insights Controller
 * Provides endpoint for on-demand AI-powered hobby insights
 */
@Controller('hobbies')
export class HobbyInsightsController {
  constructor(private readonly insightsService: HobbyInsightsService) {}

  /**
   * Get insights for a specific hobby
   * Returns AI-generated insights or data-only fallback
   */
  @Get(':id/insights')
  async getInsights(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: HobbyInsights }> {
    const insights = await this.insightsService.generateInsights(id);
    return { success: true, data: insights };
  }
}
