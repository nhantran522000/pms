import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { SleepService } from '../../application/services/sleep.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  LogSleepSchema,
  LogSleepDto,
  SleepHistoryQuerySchema,
  SleepHistoryQuery,
  SleepTrendQuerySchema,
  SleepTrendQuery,
  SleepStatsQuerySchema,
  SleepStatsQuery,
} from '@pms/shared-types';

@Controller('health/sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  /**
   * Log a sleep entry
   * POST /health/sleep
   */
  @Post()
  async logSleep(
    @Body(new ZodValidationPipe(LogSleepSchema)) dto: LogSleepDto,
  ) {
    const healthLog = await this.sleepService.logSleep(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  /**
   * Get sleep history
   * GET /health/sleep
   */
  @Get()
  async getHistory(
    @Query(new ZodValidationPipe(SleepHistoryQuerySchema)) query: SleepHistoryQuery,
  ) {
    const healthLogs = await this.sleepService.getSleepHistory(query);
    return {
      success: true,
      data: healthLogs.map((log) => log.toJSON()),
    };
  }

  /**
   * Get sleep statistics
   * GET /health/sleep/stats
   */
  @Get('stats')
  async getStats(
    @Query(new ZodValidationPipe(SleepStatsQuerySchema)) query: SleepStatsQuery,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    const stats = await this.sleepService.getSleepStats(startDate, endDate);
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Get sleep trend for charts
   * GET /health/sleep/trend
   */
  @Get('trend')
  async getTrend(
    @Query(new ZodValidationPipe(SleepTrendQuerySchema)) query: SleepTrendQuery,
  ) {
    const trendData = await this.sleepService.getSleepTrend(query);

    // Transform dates for JSON serialization
    const serializedData = trendData.map((point) => ({
      date: point.date.toISOString(),
      durationMinutes: point.durationMinutes,
      quality: point.quality,
    }));

    return {
      success: true,
      data: serializedData,
    };
  }
}
