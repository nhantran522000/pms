import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HealthLogRepository } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import { HealthData } from '../../domain/value-objects/health-data.vo';
import { TrendQuery, TrendData, TrendDataPoint, HealthLogType } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HealthTrendsService {
  private readonly logger = new Logger(HealthTrendsService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Get trend data for a specific health metric type
   */
  async getTrendData(query: TrendQuery): Promise<TrendData> {
    const tenantId = this.getTenantId();
    this.logger.log(`Getting trend data for type: ${query.type}, range: ${query.range}`);

    // Calculate date range
    const { startDate, endDate } = this.calculateDateRange(query);

    // Fetch health logs within range
    const healthLogs = await this.healthLogRepository.findTrendData(
      tenantId,
      query.type,
      startDate,
      endDate,
    );

    // Transform to chart format
    const data = this.transformToTrendData(query.type, healthLogs);

    this.logger.log(`Returning ${data.length} data points for ${query.type}`);

    return {
      type: query.type,
      data,
      startDate,
      endDate,
    };
  }

  /**
   * Calculate date range from query parameters
   */
  private calculateDateRange(query: TrendQuery): { startDate: Date; endDate: Date } {
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
      // Default to 30 days
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  }

  /**
   * Transform health logs to trend data points
   * Returns points only, no interpolation for missing days
   */
  private transformToTrendData(type: HealthLogType, logs: HealthLogEntity[]): TrendDataPoint[] {
    return logs.map((log) => {
      const healthData = HealthData.fromPrisma(log.data);
      const yValue = this.extractYValue(type, healthData);

      return {
        x: log.loggedAt.getTime(),
        y: yValue,
        date: log.loggedAt,
        notes: log.notes,
      };
    });
  }

  /**
   * Extract the primary numeric value for the chart based on health log type
   */
  private extractYValue(type: HealthLogType, data: HealthData): number {
    switch (type) {
      case 'WEIGHT': {
        const value = data.getWeightValue();
        if (value === null) {
          throw new BadRequestException('Invalid weight data');
        }
        return value;
      }
      case 'BLOOD_PRESSURE': {
        const bp = data.getBloodPressure();
        if (bp === null) {
          throw new BadRequestException('Invalid blood pressure data');
        }
        // Return systolic as the primary value for charting
        return bp.systolic;
      }
      case 'HEART_RATE': {
        const bpm = data.getHeartRate();
        if (bpm === null) {
          throw new BadRequestException('Invalid heart rate data');
        }
        return bpm;
      }
      case 'SLEEP': {
        const sleep = data.getSleepData();
        if (sleep === null) {
          throw new BadRequestException('Invalid sleep data');
        }
        // Return duration in hours for better readability
        return sleep.durationMinutes / 60;
      }
      case 'WORKOUT': {
        const workout = data.getWorkoutData();
        if (workout === null) {
          throw new BadRequestException('Invalid workout data');
        }
        // Return duration in minutes
        return workout.durationMinutes;
      }
      default:
        throw new BadRequestException(`Unknown health log type: ${type}`);
    }
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
