import {
  Controller,
  Get,
  Post,
  Put,
  Delete
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { HealthTrendsService } from '../../application/services/health-trends.service';
import { TrendQuery, TrendData, z } from '@pms/shared-types';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { TrendQuerySchema, z } from 'zod';

@Controller('health')
export class HealthTrendsController {
  constructor(private readonly healthTrendsService: HealthTrendsService) {}

  @Get('trends')
  async getTrends(@Query() query: TrendQuery): Promise<TrendData> {
    const trendData = await this.healthTrendsService.getTrendData(query);
    return {
      success: true,
      data: trendData,
    };
  }
}
