import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HealthLogRepository, CreateHealthLogInput } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import { HealthData } from '../../domain/value-objects/health-data.vo';
import {
  WorkoutDataSchema,
  WorkoutData,
  LogWorkoutDto,
  WorkoutHistoryQuery,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

export interface WorkoutStats {
  count: number;
  totalMinutes: number;
  avgIntensity: string;
  byType: Record<string, number>;
}

export interface WorkoutTrendPoint {
  date: Date;
  type: string;
  durationMinutes: number;
  intensity: string;
  caloriesBurned?: number;
}

@Injectable()
export class WorkoutService {
  private readonly logger = new Logger(WorkoutService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Log a workout entry
   */
  async logWorkout(dto: LogWorkoutDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Logging workout entry for tenant: ${tenantId}`);

    // Validate type (string, max 100 chars)
    if (!dto.type || dto.type.length > 100) {
      throw new BadRequestException('Workout type must be between 1 and 100 characters');
    }

    // Validate durationMinutes (0-max)
    if (dto.durationMinutes < 0) {
      throw new BadRequestException('Duration must be 0 or greater');
    }

    // Validate intensity
    const validIntensities = ['low', 'moderate', 'high'];
    if (!validIntensities.includes(dto.intensity)) {
      throw new BadRequestException('Intensity must be low, moderate, or high');
    }

    // Optional caloriesBurned validation
    if (dto.caloriesBurned !== undefined && dto.caloriesBurned < 0) {
      throw new BadRequestException('Calories burned must be 0 or greater');
    }

    const workoutData: WorkoutData = {
      type: dto.type,
      durationMinutes: dto.durationMinutes,
      intensity: dto.intensity,
      ...(dto.caloriesBurned !== undefined && { caloriesBurned: dto.caloriesBurned }),
    };

    // Validate against schema
    WorkoutDataSchema.parse(workoutData);

    const loggedAt = typeof dto.loggedAt === 'string' ? new Date(dto.loggedAt) : dto.loggedAt ?? new Date();

    const input: CreateHealthLogInput = {
      tenantId,
      type: 'WORKOUT',
      loggedAt,
      data: workoutData,
      notes: dto.notes ?? null,
      source: dto.source ?? 'manual',
    };

    const healthLog = await this.healthLogRepository.create(input);
    this.logger.log(`Workout entry created: ${healthLog.id}`);

    return healthLog;
  }

  /**
   * Get workout history with optional date and type filtering
   */
  async getWorkoutHistory(query?: WorkoutHistoryQuery): Promise<HealthLogEntity[]> {
    const tenantId = this.getTenantId();
    this.logger.log(`Fetching workout history for tenant: ${tenantId}`);

    const options: { startDate?: Date; endDate?: Date } = {};

    if (query?.startDate) {
      options.startDate = typeof query.startDate === 'string' ? new Date(query.startDate) : query.startDate;
    }
    if (query?.endDate) {
      options.endDate = typeof query.endDate === 'string' ? new Date(query.endDate) : query.endDate;
    }

    const logs = await this.healthLogRepository.findByType(tenantId, 'WORKOUT', options);

    // Filter by type if specified
    if (query?.type) {
      return logs.filter((log) => {
        const healthData = HealthData.fromPrisma(log.data);
        const workoutData = healthData.getWorkoutData();
        return workoutData?.type.toLowerCase() === query.type!.toLowerCase();
      });
    }

    return logs;
  }

  /**
   * Get workout statistics for a date range
   */
  async getWorkoutStats(startDate: Date, endDate: Date): Promise<WorkoutStats> {
    const tenantId = this.getTenantId();
    this.logger.log(`Calculating workout stats from ${startDate} to ${endDate}`);

    const logs = await this.healthLogRepository.findByType(tenantId, 'WORKOUT', {
      startDate,
      endDate,
    });

    if (logs.length === 0) {
      return {
        count: 0,
        totalMinutes: 0,
        avgIntensity: 'none',
        byType: {},
      };
    }

    let totalMinutes = 0;
    const intensityCount: Record<string, number> = { low: 0, moderate: 0, high: 0 };
    const byType: Record<string, number> = {};

    for (const log of logs) {
      const healthData = HealthData.fromPrisma(log.data);
      const workoutData = healthData.getWorkoutData();
      if (workoutData) {
        totalMinutes += workoutData.durationMinutes;

        // Count intensities
        const intensity = workoutData.intensity.toLowerCase();
        if (intensityCount[intensity] !== undefined) {
          intensityCount[intensity]++;
        }

        // Count by type
        const normalizedType = workoutData.type.toLowerCase();
        byType[normalizedType] = (byType[normalizedType] || 0) + 1;
      }
    }

    // Calculate average intensity
    let avgIntensity = 'moderate';
    const totalIntensityScore = intensityCount.low * 1 + intensityCount.moderate * 2 + intensityCount.high * 3;
    const avgScore = totalIntensityScore / logs.length;
    if (avgScore < 1.5) {
      avgIntensity = 'low';
    } else if (avgScore >= 2.5) {
      avgIntensity = 'high';
    }

    return {
      count: logs.length,
      totalMinutes,
      avgIntensity,
      byType,
    };
  }

  /**
   * Get workout trend data for charts
   */
  async getWorkoutTrend(range: '30' | '90' | '365'): Promise<WorkoutTrendPoint[]> {
    const tenantId = this.getTenantId();
    this.logger.log(`Fetching workout trend for range: ${range}`);

    const { startDate, endDate } = this.calculateDateRange(range);

    const logs = await this.healthLogRepository.findTrendData(
      tenantId,
      'WORKOUT',
      startDate,
      endDate,
    );

    // Transform to trend points
    const trendPoints: WorkoutTrendPoint[] = logs.map((log) => {
      const healthData = HealthData.fromPrisma(log.data);
      const workoutData = healthData.getWorkoutData();
      return {
        date: log.loggedAt,
        type: workoutData?.type ?? 'unknown',
        durationMinutes: workoutData?.durationMinutes ?? 0,
        intensity: workoutData?.intensity ?? 'moderate',
        caloriesBurned: workoutData?.caloriesBurned,
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
