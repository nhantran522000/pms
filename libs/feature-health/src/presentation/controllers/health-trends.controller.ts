import { Controller, Get, Query } from '@nestjs/common';
import { HealthTrendsService } from '../../application/services/health-trends.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { TrendQuerySchema, TrendQuery } from '@pms/shared-types';

@Controller('health')
export class HealthTrendsController {
  constructor(private readonly healthTrendsService: HealthTrendsService) {}

  @Get('trends')
  async getTrends(@Query(new ZodValidationPipe(TrendQuerySchema)) query: TrendQuery) {
    const trendData = await this.healthTrendsService.getTrendData(query);

    // Transform dates for JSON serialization
    const serializedData = trendData.data.map((point) => ({
      x: point.x,
      y: point.y,
      date: point.date.toISOString(),
      notes: point.notes,
    }));

    return {
      success: true,
      data: {
        type: trendData.type,
        data: serializedData,
        startDate: trendData.startDate.toISOString(),
        endDate: trendData.endDate.toISOString(),
      },
    };
  }
}
