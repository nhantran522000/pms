import { Controller, Get, Query } from '@nestjs/common';
import { MoodTrendsService } from '../../application/services/mood-trends.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { MoodTrendsQuerySchema, MoodTrendsQuery } from '@pms/shared-types';

@Controller('journal')
export class MoodTrendsController {
  constructor(private readonly moodTrendsService: MoodTrendsService) {}

  @Get('mood-trends')
  async getMoodTrends(
    @Query(new ZodValidationPipe(MoodTrendsQuerySchema, 'query')) query: MoodTrendsQuery,
  ) {
    const trends = await this.moodTrendsService.getMoodTrends(query);
    return { success: true, data: trends };
  }
}
