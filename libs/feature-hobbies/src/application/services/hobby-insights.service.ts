import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AiGatewayService } from '@pms/shared-kernel';
import { HobbyRepository } from '../../infrastructure/repositories/hobby.repository';
import { HobbyLogRepository } from '../../infrastructure/repositories/hobby-log.repository';
import { HobbyEntity } from '../../domain/entities/hobby.entity';
import { HobbyLogEntity } from '../../domain/entities/hobby-log.entity';
import type { HobbyInsights, HobbyTrackingType } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

/**
 * Hobby Insights Service
 * Generates AI-powered insights for hobby progress
 */
@Injectable()
export class HobbyInsightsService {
  private readonly logger = new Logger(HobbyInsightsService.name);

  constructor(
    private readonly hobbyRepository: HobbyRepository,
    private readonly hobbyLogRepository: HobbyLogRepository,
    private readonly aiGateway: AiGatewayService,
  ) {}

  /**
   * Generate insights for a hobby
   * Tries AI insights first, falls back to data-only insights on failure
   */
  async generateInsights(hobbyId: string): Promise<HobbyInsights> {
    const tenantId = this.getTenantId();
    this.logger.log(`Generating insights for hobby: ${hobbyId}`);

    // Fetch hobby and logs
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    const logs = await this.hobbyLogRepository.findByHobby(tenantId, hobbyId);

    // Try AI insights first
    try {
      const aiInsights = await this.generateAiInsights(hobby, logs);
      if (aiInsights) {
        return aiInsights;
      }
    } catch (error) {
      this.logger.warn(`AI insights failed: ${error}. Falling back to data-only.`);
    }

    // Fallback to data-only insights
    return this.createDataOnlyInsights(hobby, logs);
  }

  /**
   * Generate AI-powered insights using the ANALYZE task type
   */
  private async generateAiInsights(
    hobby: HobbyEntity,
    logs: HobbyLogEntity[],
  ): Promise<HobbyInsights | null> {
    const prompt = this.buildInsightsPrompt(hobby, logs);

    const response = await this.aiGateway.execute({
      taskType: 'ANALYZE',
      prompt,
      context: {
        hobbyName: hobby.name,
        trackingType: hobby.trackingType,
      },
    });

    if (!response.success || !response.result) {
      this.logger.warn('AI response unsuccessful or missing result');
      return null;
    }

    const result = response.result as Record<string, unknown>;

    return {
      hobbyId: hobby.id,
      hobbyName: hobby.name,
      summary: (result.summary as string) || 'Unable to generate summary.',
      trends: (result.trends as string[]) || [],
      consistencyStreaks: (result.streaks as string[]) || [],
      goalTrajectory: (result.trajectory as string[]) || [],
      milestones: (result.milestones as string[]) || [],
      generatedAt: new Date(),
      isDataOnly: false,
    };
  }

  /**
   * Build the insights prompt for AI analysis
   */
  private buildInsightsPrompt(hobby: HobbyEntity, logs: HobbyLogEntity[]): string {
    const stats = this.calculateStats(hobby, logs);

    return `Analyze this hobby tracking data and provide insights.

Hobby: ${hobby.name}
Tracking Type: ${hobby.trackingType}
Goal Target: ${hobby.goalTarget ?? 'Not set'}
Goal Deadline: ${hobby.goalDeadline?.toISOString() ?? 'Not set'}

Statistics:
- Total logs: ${stats.totalLogs}
- First log: ${stats.firstLogDate ?? 'N/A'}
- Last log: ${stats.lastLogDate ?? 'N/A'}
- Current progress: ${stats.currentProgress}
- Days tracked: ${stats.daysTracked}

Recent activity (last 10 logs):
${this.formatRecentLogs(logs.slice(-10), hobby.trackingType)}

Please provide a JSON response with the following structure:
{
  "summary": "A brief 1-2 sentence summary of progress",
  "trends": ["trend observation 1", "trend observation 2"],
  "streaks": ["consistency observation 1", "consistency observation 2"],
  "trajectory": ["goal trajectory observation 1"],
  "milestones": ["notable milestone 1", "notable milestone 2"]
}`;
  }

  /**
   * Calculate statistics from hobby logs
   */
  private calculateStats(hobby: HobbyEntity, logs: HobbyLogEntity[]) {
    let currentProgress = 0;

    if (hobby.trackingType === 'COUNTER') {
      currentProgress = logs.reduce((sum, log) => sum + (log.getCounterIncrement() ?? 1), 0);
    } else if (hobby.trackingType === 'PERCENTAGE' && logs.length > 0) {
      currentProgress = logs[logs.length - 1].getPercentage() ?? 0;
    } else if (hobby.trackingType === 'LIST') {
      currentProgress = logs.length;
    }

    const uniqueDays = new Set(
      logs.map((log) => log.loggedAt.toISOString().split('T')[0]),
    );

    return {
      totalLogs: logs.length,
      firstLogDate: logs[0]?.loggedAt.toISOString() ?? null,
      lastLogDate: logs[logs.length - 1]?.loggedAt.toISOString() ?? null,
      currentProgress,
      daysTracked: uniqueDays.size,
    };
  }

  /**
   * Format recent logs for the AI prompt
   */
  private formatRecentLogs(logs: HobbyLogEntity[], trackingType: HobbyTrackingType): string {
    return logs
      .map((log) => {
        const date = log.loggedAt.toISOString().split('T')[0];
        switch (trackingType) {
          case 'COUNTER':
            return `- ${date}: +${log.getCounterIncrement() ?? 1}`;
          case 'PERCENTAGE':
            return `- ${date}: ${log.getPercentage() ?? 0}%`;
          case 'LIST':
            return `- ${date}: "${log.getListLabel() ?? 'Unknown'}"`;
          default:
            return `- ${date}: Unknown type`;
        }
      })
      .join('\n');
  }

  /**
   * Create data-only insights (fallback when AI fails)
   */
  private createDataOnlyInsights(hobby: HobbyEntity, logs: HobbyLogEntity[]): HobbyInsights {
    const stats = this.calculateStats(hobby, logs);

    const trends: string[] = [];
    const streaks: string[] = [];
    const trajectory: string[] = [];
    const milestones: string[] = [];

    // Generate basic insights from stats
    trends.push(`Total of ${stats.totalLogs} entries over ${stats.daysTracked} days.`);

    if (hobby.trackingType === 'COUNTER') {
      trends.push(`Current total: ${stats.currentProgress}.`);
      if (stats.daysTracked > 0) {
        const avgPerDay = (stats.currentProgress / stats.daysTracked).toFixed(1);
        trends.push(`Average: ${avgPerDay} per day.`);
      }
    } else if (hobby.trackingType === 'PERCENTAGE') {
      trends.push(`Latest value: ${stats.currentProgress}%.`);
    } else if (hobby.trackingType === 'LIST') {
      trends.push(`${stats.currentProgress} items collected.`);
    }

    if (hobby.goalTarget) {
      const completionPct = Math.min((stats.currentProgress / hobby.goalTarget) * 100, 100);
      trajectory.push(`${completionPct.toFixed(1)}% toward goal of ${hobby.goalTarget}.`);
    }

    if (stats.daysTracked >= 7) {
      streaks.push(`Tracked for ${stats.daysTracked} days.`);
    }
    if (stats.daysTracked >= 30) {
      milestones.push('Reached 30 days of tracking!');
    }
    if (stats.daysTracked >= 100) {
      milestones.push('Reached 100 days of tracking!');
    }

    return {
      hobbyId: hobby.id,
      hobbyName: hobby.name,
      summary: `${hobby.name} has ${stats.totalLogs} entries over ${stats.daysTracked} days of tracking.`,
      trends,
      consistencyStreaks: streaks,
      goalTrajectory: trajectory,
      milestones,
      generatedAt: new Date(),
      isDataOnly: true,
    };
  }

  /**
   * Get tenant ID from async local storage
   */
  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
