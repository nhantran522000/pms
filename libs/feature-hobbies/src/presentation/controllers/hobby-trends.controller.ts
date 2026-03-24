import { Controller, Get, Param, Query } from '@nestjs/common';
import { HobbyTrendsService } from '../../application/services/hobby-trends.service';
import type { HobbyTrendQuery, HobbyTrendData } from '@pms/shared-types';

@Controller('hobbies')
export class HobbyTrendsController {
  constructor(private readonly trendsService: HobbyTrendsService) {}

  /**
   * GET /hobbies/:id/trends
   * Get trend data for a specific hobby
   * Query params:
   * - range: '7' | '30' | '90' | '365' (number of days)
   * - startDate: ISO date string (optional)
   * - endDate: ISO date string (optional)
   */
  @Get(':id/trends')
  async getTrendData(
    @Param('id') id: string,
    @Query() query: Omit<HobbyTrendQuery, 'hobbyId'>,
  ): Promise<{ success: boolean; data: HobbyTrendData }> {
    const trendData = await this.trendsService.getTrendData({
      ...query,
      hobbyId: id,
    });
    return { success: true, data: trendData };
  }
}
