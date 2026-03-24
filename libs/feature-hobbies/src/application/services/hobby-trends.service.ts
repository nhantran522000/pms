import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { HobbyRepository } from '../../infrastructure/repositories/hobby.repository';
import { HobbyLogRepository } from '../../infrastructure/repositories/hobby-log.repository';
import { HobbyLogEntity } from '../../domain/entities/hobby-log.entity';
import type { HobbyTrendQuery, HobbyTrendData, CounterChartData, HobbyTrendDataPoint, HobbyTrackingType } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HobbyTrendsService {
  private readonly logger = new Logger(HobbyTrendsService.name);

  constructor(
    private readonly hobbyRepository: HobbyRepository,
    private readonly hobbyLogRepository: HobbyLogRepository,
  ) {}

  async getTrendData(query: HobbyTrendQuery): Promise<HobbyTrendData> {
    const tenantId = this.getTenantId();
    this.logger.log(`Getting trend data for hobby: ${query.hobbyId}, range: ${query.range}`);

    // Fetch hobby to get tracking type
    const hobby = await this.hobbyRepository.findById(tenantId, query.hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    // Calculate date range
    const { startDate, endDate } = this.calculateDateRange(query);

    // Fetch logs within range
    const logs = await this.hobbyLogRepository.findByHobbyAndDateRange(
      tenantId,
      query.hobbyId,
      startDate,
      endDate,
    );

    // Transform to chart format based on tracking type
    const data = this.transformToTrendData(hobby.trackingType, logs);

    return {
      hobbyId: query.hobbyId,
      trackingType: hobby.trackingType,
      data,
      startDate,
      endDate,
    };
  }

  private calculateDateRange(query: HobbyTrendQuery): { startDate: Date; endDate: Date } {
    const endDate = query.endDate ? new Date(query.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    let startDate: Date;

    if (query.startDate) {
      startDate = new Date(query.startDate);
      startDate.setHours(0, 0, 0, 0);
    } else if (query.range) {
      const days = parseInt(query.range, 10);
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days + 1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default to 30 days per CONTEXT.md
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  }

  private transformToTrendData(
    trackingType: HobbyTrackingType,
    logs: HobbyLogEntity[],
  ): CounterChartData | HobbyTrendDataPoint[] {
    switch (trackingType) {
      case 'COUNTER':
        return this.buildCounterChartData(logs);
      case 'PERCENTAGE':
        return this.buildPercentageChartData(logs);
      case 'LIST':
        return this.buildListActivityChartData(logs);
      default:
        throw new BadRequestException(`Unknown tracking type: ${trackingType}`);
    }
  }

  // Per CONTEXT.md: Counter charts show bar chart (per-log values) + running total line overlay
  private buildCounterChartData(logs: HobbyLogEntity[]): CounterChartData {
    let runningTotal = 0;

    const bars: HobbyTrendDataPoint[] = logs.map((log) => {
      const increment = log.getCounterIncrement() ?? 1;
      return {
        x: log.loggedAt.getTime(),
        y: increment,
        date: log.loggedAt,
        notes: log.notes,
      };
    });

    const line: HobbyTrendDataPoint[] = [];
    bars.forEach((bar) => {
      runningTotal += bar.y;
      line.push({
        x: bar.x,
        y: runningTotal,
        date: bar.date,
        notes: bar.notes,
      });
    });

    return { bars, line };
  }

  // Per CONTEXT.md: Percentage charts show line chart over time
  private buildPercentageChartData(logs: HobbyLogEntity[]): HobbyTrendDataPoint[] {
    return logs.map((log) => ({
      x: log.loggedAt.getTime(),
      y: log.getPercentage() ?? 0,
      date: log.loggedAt,
      notes: log.notes,
    }));
  }

  // Per CONTEXT.md: List progress shows count of entries per day (activity cadence)
  private buildListActivityChartData(logs: HobbyLogEntity[]): HobbyTrendDataPoint[] {
    // Group by date
    const byDate = new Map<string, { count: number; date: Date }>();

    logs.forEach((log) => {
      const dateKey = log.loggedAt.toISOString().split('T')[0];
      const existing = byDate.get(dateKey);
      if (existing) {
        existing.count += 1;
      } else {
        byDate.set(dateKey, { count: 1, date: log.loggedAt });
      }
    });

    // Convert to chart points sorted by date
    return Array.from(byDate.entries())
      .map(([_, { count, date }]) => ({
        x: new Date(date).setHours(0, 0, 0, 0),
        y: count,
        date: new Date(date),
        notes: null,
      }))
      .sort((a, b) => a.x - b.x);
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
