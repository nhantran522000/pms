import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HealthLogRepository, CreateHealthLogInput } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import { HealthData } from '../../domain/value-objects/health-data.vo';
import {
  SleepDataSchema,
  SleepData,
  LogSleepDto,
  LogSleepSchema,
  SleepHistoryQuerySchema,
  SleepHistoryQuery,
  SleepTrendQuerySchema,
  SleepTrendQuery,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';
import { z } from 'zod';

export interface SleepStats {
  avgDuration: number;
  avgQuality: number;
  totalNights: number;
}

export interface SleepTrendPoint {
  date: Date;
  durationMinutes: number;
  quality: number;
}

@Injectable()
export class SleepService {
  private readonly logger = new Logger(SleepService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Log a sleep entry
   */
  async logSleep(dto: LogSleepDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Logging sleep entry for tenant: ${tenantId}`);

    // Validate duration (0-1440 minutes, max 24 hours)
    if (dto.durationMinutes < 0 || dto.durationMinutes > 1440) {
      throw new BadRequestException('Duration must be between 0 and 1440 minutes (24 hours)');
    }

    // Validate quality (1-5)
    if (dto.quality < 1 || dto.quality > 5) {
      throw new BadRequestException('Quality must be between 1 (poor) and 5 (excellent)');
    }

    const sleepData: SleepData = {
      durationMinutes: dto.durationMinutes,
      quality: dto.quality,
    };

    // Validate against schema
    SleepDataSchema.parse(sleepData);

    const loggedAt = typeof dto.loggedAt === 'string' ? new Date(dto.loggedAt) : dto.loggedAt ?? new Date();

    const input: CreateHealthLogInput = {
      tenantId,
      type: 'SLEEP',
      loggedAt,
      data: sleepData,
      notes: dto.notes ?? null,
      source: dto.source ?? 'manual',
    };

    const healthLog = await this.healthLogRepository.create(input);
    this.logger.log(`Sleep entry created: ${healthLog.id}`);

    return healthLog;
  }

  /**
   * Get sleep history with optional date filtering
   */
  async getSleepHistory(query?: SleepHistoryQuery): Promise<HealthLogEntity[]> {
    const tenantId = this.getTenantId();
    this.logger.log(`Fetching sleep history for tenant: ${tenantId}`);

    const options: { startDate?: Date; endDate?: Date } = {};

    if (query?.startDate) {
      options.startDate = typeof query.startDate === 'string' ? new Date(query.startDate) : query.startDate;
    }
    if (query?.endDate) {
      options.endDate = typeof query.endDate === 'string' ? new Date(query.endDate) : query.endDate;
    }

    return this.healthLogRepository.findByType(tenantId, 'SLEEP', options);
  }

  /**
   * Get sleep statistics for a date range
   */
  async getSleepStats(startDate: Date, endDate: Date): Promise<SleepStats> {
    const tenantId = this.getTenantId();
    this.logger.log(`Calculating sleep stats from ${startDate} to ${endDate}`);

    const logs = await this.healthLogRepository.findByType(tenantId, 'SLEEP', {
      startDate,
      endDate,
    });

    if (logs.length === 0) {
      return {
        avgDuration: 0,
        avgQuality: 0,
        totalNights: 0,
      };
    }

    let totalDuration = 0;
    let totalQuality = 0;

    for (const log of logs) {
      const healthData = HealthData.fromPrisma(log.data);
      const sleepData = healthData.getSleepData();
      if (sleepData) {
        totalDuration += sleepData.durationMinutes;
        totalQuality += sleepData.quality;
      }
    }

    return {
      avgDuration: Math.round(totalDuration / logs.length),
      avgQuality: Math.round((totalQuality / logs.length) * 10) / 10,
      totalNights: logs.length,
    };
  }

  /**
   * Get sleep trend data for charts
   */
  async getSleepTrend(query: SleepTrendQuery): Promise<SleepTrendPoint[]> {
    const tenantId = this.getTenantId();
    this.logger.log(`Fetching sleep trend for range: ${query.range}`);

    const { startDate, endDate } = this.calculateDateRange(query.range);

    const logs = await this.healthLogRepository.findTrendData(
      tenantId,
      'SLEEP',
      startDate,
      endDate,
    );

    // Transform to trend points
    const trendPoints: SleepTrendPoint[] = logs.map((log) => {
      const healthData = HealthData.fromPrisma(log.data);
      const sleepData = healthData.getSleepData();
      return {
        date: log.loggedAt,
        durationMinutes: sleepData?.durationMinutes ?? 0,
        quality: sleepData?.quality ?? 0,
      };
    });

    return trendPoints;
  }

  /**
   * Calculate date range from range parameter
   */
  private calculateDateRange(range: '30' | '90' | '365'): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const days = parseInt(range, 10);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  }

  /**
   * Get tenant ID from context with validation
   */
  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
