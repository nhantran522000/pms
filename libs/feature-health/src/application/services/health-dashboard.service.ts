import { Injectable, Logger } from '@nestjs/common';
import { HealthLogRepository } from '../../infrastructure/repositories/health-log.repository';
import { HealthData } from '../../domain/value-objects/health-data.vo';
import {
  BloodPressureData,
  HeartRateData,
  WeightData,
} from '@pms/shared-types';
import {
  getBloodPressureCategory,
  getHeartRateCategory,
} from '../../domain/constants/reference-ranges';
import { getTenantId } from '@pms/data-access';

export type TrendIndicator = 'up' | 'down' | 'stable';

export interface WeightSummary {
  latest: number | null;
  trend: TrendIndicator;
  entriesThisWeek: number;
  loggedAt: Date | null;
}

export interface VitalsSummary {
  bloodPressure: {
    systolic: number | null;
    diastolic: number | null;
    category: string | null;
    loggedAt: Date | null;
  };
  heartRate: {
    bpm: number | null;
    category: string | null;
    loggedAt: Date | null;
  };
}

export interface SleepSummary {
  avgDuration: number;
  avgQuality: number;
  trend: TrendIndicator;
  entriesThisWeek: number;
}

export interface WorkoutSummary {
  count: number;
  totalMinutes: number;
  byType: Record<string, number>;
  avgIntensity: string;
}

export interface Achievement {
  type: 'streak' | 'consistency' | 'milestone';
  title: string;
  description: string;
  icon: string;
}

export interface HealthDashboardResponse {
  weight: WeightSummary;
  vitals: VitalsSummary;
  sleep: SleepSummary;
  workouts: WorkoutSummary;
  loggingStreak: number;
  achievements: Achievement[];
  generatedAt: Date;
}

@Injectable()
export class HealthDashboardService {
  private readonly logger = new Logger(HealthDashboardService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Get complete dashboard data
   */
  async getDashboard(): Promise<HealthDashboardResponse> {
    const tenantId = this.getTenantId();
    this.logger.log(`Fetching dashboard data for tenant: ${tenantId}`);

    const now = new Date();
    const weekStart = this.getStartOfWeek(now);
    const weekEnd = this.getEndOfWeek(now);

    // Fetch all data in parallel for efficiency
    const [weightSummary, vitalsSummary, sleepSummary, workoutSummary, loggingStreak, achievements] =
      await Promise.all([
        this.getWeightSummary(tenantId, weekStart, weekEnd),
        this.getVitalsSummary(tenantId),
        this.getSleepSummary(tenantId, weekStart, weekEnd),
        this.getWorkoutSummary(tenantId, weekStart, weekEnd),
        this.calculateLoggingStreak(tenantId),
        this.getAchievements(tenantId),
      ]);

    return {
      weight: weightSummary,
      vitals: vitalsSummary,
      sleep: sleepSummary,
      workouts: workoutSummary,
      loggingStreak,
      achievements,
      generatedAt: now,
    };
  }

  /**
   * Get weight summary only
   */
  async getWeightSummaryOnly(): Promise<WeightSummary> {
    const tenantId = this.getTenantId();
    const now = new Date();
    const weekStart = this.getStartOfWeek(now);
    const weekEnd = this.getEndOfWeek(now);
    return this.getWeightSummary(tenantId, weekStart, weekEnd);
  }

  /**
   * Get vitals summary only
   */
  async getVitalsSummaryOnly(): Promise<VitalsSummary> {
    const tenantId = this.getTenantId();
    return this.getVitalsSummary(tenantId);
  }

  /**
   * Get sleep summary only
   */
  async getSleepSummaryOnly(): Promise<SleepSummary> {
    const tenantId = this.getTenantId();
    const now = new Date();
    const weekStart = this.getStartOfWeek(now);
    const weekEnd = this.getEndOfWeek(now);
    return this.getSleepSummary(tenantId, weekStart, weekEnd);
  }

  /**
   * Get workout summary only
   */
  async getWorkoutSummaryOnly(): Promise<WorkoutSummary> {
    const tenantId = this.getTenantId();
    const now = new Date();
    const weekStart = this.getStartOfWeek(now);
    const weekEnd = this.getEndOfWeek(now);
    return this.getWorkoutSummary(tenantId, weekStart, weekEnd);
  }

  /**
   * Calculate weight summary with trend
   */
  private async getWeightSummary(
    tenantId: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<WeightSummary> {
    // Get latest weight entries
    const weightLogs = await this.healthLogRepository.findByType(
      tenantId,
      'WEIGHT',
      { limit: 10 },
    );

    // Get this week's entries
    const weeklyLogs = await this.healthLogRepository.findByType(
      tenantId,
      'WEIGHT',
      { startDate: weekStart, endDate: weekEnd },
    );

    if (weightLogs.length === 0) {
      return {
        latest: null,
        trend: 'stable',
        entriesThisWeek: 0,
        loggedAt: null,
      };
    }

    // Extract latest weight
    const latestLog = weightLogs[0];
    const healthData = HealthData.fromPrisma(latestLog.data);
    const weightData = healthData.getWeightData() as WeightData | null;
    const latest = weightData?.kg ?? null;

    // Calculate trend (compare last 3 entries to previous 3)
    const trend = this.calculateTrend(
      weightLogs.slice(0, 3).map((log) => {
        const data = HealthData.fromPrisma(log.data);
        return data.getWeightValue() ?? 0;
      }),
      weightLogs.slice(3, 6).map((log) => {
        const data = HealthData.fromPrisma(log.data);
        return data.getWeightValue() ?? 0;
      }),
    );

    return {
      latest,
      trend,
      entriesThisWeek: weeklyLogs.length,
      loggedAt: latestLog.loggedAt,
    };
  }

  /**
   * Calculate vitals summary
   */
  private async getVitalsSummary(tenantId: string): Promise<VitalsSummary> {
    // Get latest blood pressure
    const bpLogs = await this.healthLogRepository.findByType(
      tenantId,
      'BLOOD_PRESSURE',
      { limit: 1 },
    );

    // Get latest heart rate
    const hrLogs = await this.healthLogRepository.findByType(
      tenantId,
      'HEART_RATE',
      { limit: 1 },
    );

    const bloodPressure = {
      systolic: null as number | null,
      diastolic: null as number | null,
      category: null as string | null,
      loggedAt: null as Date | null,
    };

    const heartRate = {
      bpm: null as number | null,
      category: null as string | null,
      loggedAt: null as Date | null,
    };

    if (bpLogs.length > 0) {
      const bpData = bpLogs[0].data as BloodPressureData;
      bloodPressure.systolic = bpData.systolic;
      bloodPressure.diastolic = bpData.diastolic;
      bloodPressure.category = getBloodPressureCategory(bpData.systolic, bpData.diastolic);
      bloodPressure.loggedAt = bpLogs[0].loggedAt;
    }

    if (hrLogs.length > 0) {
      const hrData = hrLogs[0].data as HeartRateData;
      heartRate.bpm = hrData.bpm;
      heartRate.category = getHeartRateCategory(hrData.bpm);
      heartRate.loggedAt = hrLogs[0].loggedAt;
    }

    return { bloodPressure, heartRate };
  }

  /**
   * Calculate sleep summary with trend
   */
  private async getSleepSummary(
    tenantId: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<SleepSummary> {
    // Get sleep logs for trend calculation (last 14 days)
    const twoWeeksAgo = new Date(weekStart);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const sleepLogs = await this.healthLogRepository.findByType(
      tenantId,
      'SLEEP',
      { startDate: twoWeeksAgo, endDate: weekEnd },
    );

    // This week's entries
    const thisWeekLogs = sleepLogs.filter((log) => log.loggedAt >= weekStart);

    if (sleepLogs.length === 0) {
      return {
        avgDuration: 0,
        avgQuality: 0,
        trend: 'stable',
        entriesThisWeek: 0,
      };
    }

    // Calculate this week's averages
    let totalDuration = 0;
    let totalQuality = 0;

    for (const log of thisWeekLogs) {
      const healthData = HealthData.fromPrisma(log.data);
      const sleepData = healthData.getSleepData();
      if (sleepData) {
        totalDuration += sleepData.durationMinutes;
        totalQuality += sleepData.quality;
      }
    }

    const avgDuration = thisWeekLogs.length > 0 ? Math.round(totalDuration / thisWeekLogs.length) : 0;
    const avgQuality = thisWeekLogs.length > 0 ? Math.round((totalQuality / thisWeekLogs.length) * 10) / 10 : 0;

    // Calculate trend (this week vs last week)
    const lastWeekLogs = sleepLogs.filter(
      (log) => log.loggedAt >= twoWeeksAgo && log.loggedAt < weekStart,
    );

    const lastWeekAvgDuration = this.calculateAverageDuration(lastWeekLogs);
    const trend = this.calculateDurationTrend(avgDuration, lastWeekAvgDuration);

    return {
      avgDuration,
      avgQuality,
      trend,
      entriesThisWeek: thisWeekLogs.length,
    };
  }

  /**
   * Calculate workout summary
   */
  private async getWorkoutSummary(
    tenantId: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<WorkoutSummary> {
    const workoutLogs = await this.healthLogRepository.findByType(
      tenantId,
      'WORKOUT',
      { startDate: weekStart, endDate: weekEnd },
    );

    if (workoutLogs.length === 0) {
      return {
        count: 0,
        totalMinutes: 0,
        byType: {},
        avgIntensity: 'none',
      };
    }

    let totalMinutes = 0;
    const intensityCount: Record<string, number> = { low: 0, moderate: 0, high: 0 };
    const byType: Record<string, number> = {};

    for (const log of workoutLogs) {
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
    const totalIntensityScore =
      intensityCount.low * 1 + intensityCount.moderate * 2 + intensityCount.high * 3;
    const avgScore = totalIntensityScore / workoutLogs.length;
    if (avgScore < 1.5) {
      avgIntensity = 'low';
    } else if (avgScore >= 2.5) {
      avgIntensity = 'high';
    }

    return {
      count: workoutLogs.length,
      totalMinutes,
      byType,
      avgIntensity,
    };
  }

  /**
   * Calculate consecutive days with any health entry
   */
  private async calculateLoggingStreak(tenantId: string): Promise<number> {
    const types = ['WEIGHT', 'BLOOD_PRESSURE', 'HEART_RATE', 'SLEEP', 'WORKOUT'] as const;

    // Get all logs from the last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const allLogs = await Promise.all(
      types.map((type) =>
        this.healthLogRepository.findByType(tenantId, type, {
          startDate: oneYearAgo,
        }),
      ),
    );

    // Flatten and extract unique dates
    const datesWithEntries = new Set<string>();
    for (const logs of allLogs) {
      for (const log of logs) {
        const dateStr = log.loggedAt.toISOString().split('T')[0];
        datesWithEntries.add(dateStr);
      }
    }

    // Count consecutive days from today backwards
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (datesWithEntries.has(dateStr)) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    return streak;
  }

  /**
   * Get achievements based on streak and consistency
   */
  private async getAchievements(tenantId: string): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    const streak = await this.calculateLoggingStreak(tenantId);

    // Streak milestones
    if (streak >= 7) {
      achievements.push({
        type: 'streak',
        title: 'Week Warrior',
        description: '7 consecutive days of health logging',
        icon: 'calendar-check',
      });
    }
    if (streak >= 14) {
      achievements.push({
        type: 'streak',
        title: 'Two Week Champion',
        description: '14 consecutive days of health logging',
        icon: 'award',
      });
    }
    if (streak >= 30) {
      achievements.push({
        type: 'streak',
        title: 'Monthly Master',
        description: '30 consecutive days of health logging',
        icon: 'trophy',
      });
    }
    if (streak >= 100) {
      achievements.push({
        type: 'milestone',
        title: 'Century Club',
        description: '100 consecutive days of health logging',
        icon: 'star',
      });
    }

    // Consistency badges (based on weekly patterns)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const types = ['WEIGHT', 'BLOOD_PRESSURE', 'HEART_RATE', 'SLEEP', 'WORKOUT'] as const;

    const monthlyLogs = await Promise.all(
      types.map((type) =>
        this.healthLogRepository.findByType(tenantId, type, { startDate: monthStart }),
      ),
    );

    const totalMonthlyEntries = monthlyLogs.flat().length;
    const daysThisMonth = Math.floor((now.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (totalMonthlyEntries >= daysThisMonth * 0.8) {
      achievements.push({
        type: 'consistency',
        title: 'Consistency King',
        description: 'Logging 80%+ of days this month',
        icon: 'check-circle',
      });
    }

    return achievements;
  }

  /**
   * Calculate trend indicator based on two sets of values
   */
  private calculateTrend(recent: number[], previous: number[]): TrendIndicator {
    if (recent.length === 0 || previous.length === 0) {
      return 'stable';
    }

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    const changePercent = Math.abs((recentAvg - previousAvg) / previousAvg) * 100;

    // Less than 2% change is considered stable
    if (changePercent < 2) {
      return 'stable';
    }

    return recentAvg > previousAvg ? 'up' : 'down';
  }

  /**
   * Calculate average duration from sleep logs
   */
  private calculateAverageDuration(logs: { data: Record<string, unknown> }[]): number {
    if (logs.length === 0) return 0;

    let total = 0;
    for (const log of logs) {
      const healthData = HealthData.fromPrisma(log.data);
      const sleepData = healthData.getSleepData();
      if (sleepData) {
        total += sleepData.durationMinutes;
      }
    }
    return Math.round(total / logs.length);
  }

  /**
   * Calculate trend for sleep duration
   */
  private calculateDurationTrend(
    thisWeekAvg: number,
    lastWeekAvg: number,
  ): TrendIndicator {
    if (lastWeekAvg === 0) return 'stable';

    const changePercent = Math.abs((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100;

    if (changePercent < 5) {
      return 'stable';
    }

    return thisWeekAvg > lastWeekAvg ? 'up' : 'down';
  }

  /**
   * Get start of current week (Sunday)
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of current week (Saturday)
   */
  private getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (6 - day));
    d.setHours(23, 59, 59, 999);
    return d;
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
