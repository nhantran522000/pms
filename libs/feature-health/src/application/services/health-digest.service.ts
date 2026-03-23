import { Injectable, Logger } from '@nestjs/common';
import { AiGatewayService } from '@pms/shared-kernel';
import { HealthLogRepository } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogType } from '@pms/shared-types';

/**
 * Input structure for generating a health digest
 */
export interface DigestInput {
  userName: string;
  weekStart: Date;
  weekEnd: Date;
  metrics: {
    weight?: {
      entries: Array<{ value: number; unit: string; date: Date }>;
      trend: 'up' | 'down' | 'stable';
    };
    vitals?: {
      entries: Array<{ systolic: number; diastolic: number; bpm?: number; date: Date }>;
      avgBP: string;
      avgHR: number | null;
    };
    sleep?: {
      entries: Array<{ durationMinutes: number; quality: number; date: Date }>;
      avgDuration: number;
      avgQuality: number;
    };
    workouts?: {
      entries: Array<{ type: string; durationMinutes: number; intensity: string; date: Date }>;
      count: number;
      totalMinutes: number;
    };
  };
  streaks?: {
    loggingStreak: number;
    workoutStreak: number;
  };
}

/**
 * Generated health digest content
 */
export interface HealthDigest {
  greeting: string;
  summary: string;
  trends: string[];
  correlations: string[];
  recommendations: string[];
  achievements: string[];
  generatedAt: Date;
  isDataOnly: boolean;
}

@Injectable()
export class HealthDigestService {
  private readonly logger = new Logger(HealthDigestService.name);

  constructor(
    private readonly aiGateway: AiGatewayService,
    private readonly healthLogRepository: HealthLogRepository,
  ) {}

  /**
   * Generate a weekly health digest for a user
   * Uses AI to analyze trends, correlations, and provide recommendations
   * Falls back to data-only digest if AI fails
   */
  async generateDigest(tenantId: string, userName: string): Promise<HealthDigest> {
    const { weekStart, weekEnd } = this.getWeekBounds();

    this.logger.log(`Generating health digest for tenant ${tenantId}, week ${weekStart.toISOString()} to ${weekEnd.toISOString()}`);

    // Gather week's health data
    const digestInput = await this.gatherHealthData(tenantId, userName, weekStart, weekEnd);

    // Try AI-powered digest generation
    try {
      const aiDigest = await this.generateAiDigest(digestInput);
      if (aiDigest) {
        this.logger.log('AI-powered digest generated successfully');
        return aiDigest;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`AI digest generation failed: ${errorMessage}. Falling back to data-only digest.`);
    }

    // Fallback to data-only digest
    return this.createDataOnlyDigest(digestInput);
  }

  /**
   * Get the start and end dates for the current week (Sunday to Saturday)
   */
  private getWeekBounds(): { weekStart: Date; weekEnd: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Calculate start of week (Sunday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    // Calculate end of week (Saturday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  }

  /**
   * Gather all health data for the digest input
   */
  private async gatherHealthData(
    tenantId: string,
    userName: string,
    weekStart: Date,
    weekEnd: Date,
  ): Promise<DigestInput> {
    const input: DigestInput = {
      userName,
      weekStart,
      weekEnd,
      metrics: {},
    };

    // Fetch weight data
    const weightLogs = await this.healthLogRepository.findByType(tenantId, 'WEIGHT', {
      startDate: weekStart,
      endDate: weekEnd,
    });
    if (weightLogs.length > 0) {
      input.metrics.weight = {
        entries: weightLogs.map((log) => ({
          value: log.data.value as number,
          unit: log.data.unit as string,
          date: log.loggedAt,
        })),
        trend: this.calculateWeightTrend(weightLogs),
      };
    }

    // Fetch vitals data (blood pressure and heart rate)
    const bpLogs = await this.healthLogRepository.findByType(tenantId, 'BLOOD_PRESSURE', {
      startDate: weekStart,
      endDate: weekEnd,
    });
    const hrLogs = await this.healthLogRepository.findByType(tenantId, 'HEART_RATE', {
      startDate: weekStart,
      endDate: weekEnd,
    });
    if (bpLogs.length > 0 || hrLogs.length > 0) {
      const bpEntries = bpLogs.map((log) => ({
        systolic: log.data.systolic as number,
        diastolic: log.data.diastolic as number,
        date: log.loggedAt,
      }));
      const avgSystolic = bpEntries.length > 0
        ? Math.round(bpEntries.reduce((sum, e) => sum + e.systolic, 0) / bpEntries.length)
        : 0;
      const avgDiastolic = bpEntries.length > 0
        ? Math.round(bpEntries.reduce((sum, e) => sum + e.diastolic, 0) / bpEntries.length)
        : 0;

      const hrValues = hrLogs.map((log) => log.data.bpm as number);
      const avgHR = hrValues.length > 0
        ? Math.round(hrValues.reduce((sum, bpm) => sum + bpm, 0) / hrValues.length)
        : null;

      input.metrics.vitals = {
        entries: bpEntries,
        avgBP: avgSystolic > 0 ? `${avgSystolic}/${avgDiastolic}` : 'N/A',
        avgHR,
      };
    }

    // Fetch sleep data
    const sleepLogs = await this.healthLogRepository.findByType(tenantId, 'SLEEP', {
      startDate: weekStart,
      endDate: weekEnd,
    });
    if (sleepLogs.length > 0) {
      const entries = sleepLogs.map((log) => ({
        durationMinutes: log.data.durationMinutes as number,
        quality: log.data.quality as number,
        date: log.loggedAt,
      }));
      const totalDuration = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
      const totalQuality = entries.reduce((sum, e) => sum + e.quality, 0);

      input.metrics.sleep = {
        entries,
        avgDuration: Math.round(totalDuration / entries.length),
        avgQuality: Math.round((totalQuality / entries.length) * 10) / 10,
      };
    }

    // Fetch workout data
    const workoutLogs = await this.healthLogRepository.findByType(tenantId, 'WORKOUT', {
      startDate: weekStart,
      endDate: weekEnd,
    });
    if (workoutLogs.length > 0) {
      const entries = workoutLogs.map((log) => ({
        type: log.data.type as string,
        durationMinutes: log.data.durationMinutes as number,
        intensity: log.data.intensity as string,
        date: log.loggedAt,
      }));

      input.metrics.workouts = {
        entries,
        count: entries.length,
        totalMinutes: entries.reduce((sum, e) => sum + e.durationMinutes, 0),
      };
    }

    return input;
  }

  /**
   * Calculate weight trend from logs
   */
  private calculateWeightTrend(
    logs: Array<{ data: Record<string, unknown>; loggedAt: Date }>,
  ): 'up' | 'down' | 'stable' {
    if (logs.length < 2) return 'stable';

    const sorted = [...logs].sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
    const first = sorted[0].data.value as number;
    const last = sorted[sorted.length - 1].data.value as number;
    const diff = last - first;

    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'up' : 'down';
  }

  /**
   * Generate AI-powered digest using the ANALYZE task type
   */
  private async generateAiDigest(input: DigestInput): Promise<HealthDigest | null> {
    const prompt = this.buildDigestPrompt(input);

    const response = await this.aiGateway.execute({
      taskType: 'ANALYZE',
      prompt,
      context: {
        userName: input.userName,
        weekStart: input.weekStart.toISOString(),
        weekEnd: input.weekEnd.toISOString(),
        metrics: input.metrics,
      },
    });

    if (!response.success || !response.result) {
      this.logger.warn(`AI digest failed: ${response.error}`);
      return null;
    }

    // Parse AI response into structured digest
    const result = response.result as Record<string, unknown>;

    return {
      greeting: (result.greeting as string) || `Hi ${input.userName}!`,
      summary: (result.summary as string) || '',
      trends: (result.trends as string[]) || [],
      correlations: (result.correlations as string[]) || [],
      recommendations: (result.recommendations as string[]) || [],
      achievements: (result.achievements as string[]) || [],
      generatedAt: new Date(),
      isDataOnly: false,
    };
  }

  /**
   * Build the AI prompt for digest generation
   */
  private buildDigestPrompt(input: DigestInput): string {
    const metricsSummary: string[] = [];

    if (input.metrics.weight) {
      const trend = input.metrics.weight.trend;
      const count = input.metrics.weight.entries.length;
      metricsSummary.push(`Weight: ${count} entries, trend: ${trend}`);
    }

    if (input.metrics.vitals) {
      metricsSummary.push(`Blood Pressure avg: ${input.metrics.vitals.avgBP}`);
      if (input.metrics.vitals.avgHR) {
        metricsSummary.push(`Heart Rate avg: ${input.metrics.vitals.avgHR} bpm`);
      }
    }

    if (input.metrics.sleep) {
      const hours = Math.floor(input.metrics.sleep.avgDuration / 60);
      const mins = input.metrics.sleep.avgDuration % 60;
      metricsSummary.push(`Sleep avg: ${hours}h ${mins}m, quality: ${input.metrics.sleep.avgQuality}/5`);
    }

    if (input.metrics.workouts) {
      metricsSummary.push(
        `Workouts: ${input.metrics.workouts.count} sessions, ${input.metrics.workouts.totalMinutes} total minutes`,
      );
    }

    return `Generate a weekly health digest for ${input.userName}.

Week: ${input.weekStart.toLocaleDateString()} to ${input.weekEnd.toLocaleDateString()}

Health Data Summary:
${metricsSummary.length > 0 ? metricsSummary.join('\n') : 'No health data logged this week'}

Please analyze this data and provide:
1. A personalized greeting (friendly and supportive tone)
2. A brief summary of their week (2-3 sentences)
3. Key trends observed (2-3 trends)
4. Cross-metric correlations if any (e.g., sleep vs workouts)
5. Actionable recommendations (2-3 gentle suggestions)
6. Achievements or consistency notes (if applicable)

Format your response as JSON:
{
  "greeting": "string",
  "summary": "string",
  "trends": ["string", ...],
  "correlations": ["string", ...],
  "recommendations": ["string", ...],
  "achievements": ["string", ...]
}

Keep the tone supportive and encouraging, not clinical. If there's no data, encourage them to start tracking.`;
  }

  /**
   * Create a data-only digest when AI fails
   */
  private createDataOnlyDigest(input: DigestInput): HealthDigest {
    const trends: string[] = [];
    const achievements: string[] = [];

    // Build basic trends from raw data
    if (input.metrics.weight) {
      trends.push(`Weight trend this week: ${input.metrics.weight.trend}`);
    }
    if (input.metrics.vitals) {
      trends.push(`Average blood pressure: ${input.metrics.vitals.avgBP}`);
      if (input.metrics.vitals.avgHR) {
        trends.push(`Average heart rate: ${input.metrics.vitals.avgHR} bpm`);
      }
    }
    if (input.metrics.sleep) {
      const hours = Math.floor(input.metrics.sleep.avgDuration / 60);
      const mins = input.metrics.sleep.avgDuration % 60;
      trends.push(`Average sleep: ${hours}h ${mins}m (${input.metrics.sleep.avgQuality}/5 quality)`);
    }
    if (input.metrics.workouts) {
      trends.push(`${input.metrics.workouts.count} workouts completed (${input.metrics.workouts.totalMinutes} minutes)`);
      achievements.push(`You completed ${input.metrics.workouts.count} workout(s) this week!`);
    }

    // Check for data availability
    const hasData = Object.keys(input.metrics).length > 0;

    return {
      greeting: `Hi ${input.userName}!`,
      summary: hasData
        ? "Here's your weekly health summary. Our AI insights are temporarily unavailable, but here's your raw data."
        : "No health data was logged this week. Start tracking to see your weekly insights!",
      trends,
      correlations: [],
      recommendations: hasData
        ? ['Keep logging your health data consistently for better insights next week!']
        : ['Start logging your weight, vitals, sleep, or workouts to receive personalized insights.'],
      achievements,
      generatedAt: new Date(),
      isDataOnly: true,
    };
  }
}
