import { Injectable, Logger } from '@nestjs/common';
import { JournalEntryRepository } from '../../infrastructure/repositories/journal-entry.repository';
import { MoodTrends, MoodTrendsQuery } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

export type TrendDirection = 'improving' | 'stable' | 'declining';

@Injectable()
export class MoodTrendsService {
  private readonly logger = new Logger(MoodTrendsService.name);
  private readonly TREND_THRESHOLD = 0.3;

  constructor(private readonly journalRepository: JournalEntryRepository) {}

  async getMoodTrends(query: MoodTrendsQuery): Promise<MoodTrends> {
    const tenantId = this.getTenantId();
    const days = query.days ?? 30;
    this.logger.log(`Getting mood trends for ${days} days`);

    const moodData = await this.journalRepository.getMoodTrends(tenantId, days);

    if (moodData.length === 0) {
      return { entries: [], averageMood: 0, trend: 'stable' };
    }

    const entries = moodData.map((entry) => ({
      date: entry.date.toISOString().split('T')[0],
      mood: entry.mood,
    }));

    const totalMood = moodData.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = Math.round((totalMood / moodData.length) * 10) / 10;
    const trend = this.calculateTrend(moodData);

    this.logger.log(`Mood trends: avg=${averageMood}, trend=${trend}, entries=${entries.length}`);
    return { entries, averageMood, trend };
  }

  private calculateTrend(moodData: Array<{ date: Date; mood: number }>): TrendDirection {
    if (moodData.length < 2) return 'stable';
    
    const midpoint = Math.floor(moodData.length / 2);
    const firstHalf = moodData.slice(0, midpoint);
    const secondHalf = moodData.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, e) => sum + e.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + e.mood, 0) / secondHalf.length;
    const diff = secondAvg - firstAvg;

    if (diff > this.TREND_THRESHOLD) return 'improving';
    if (diff < -this.TREND_THRESHOLD) return 'declining';
    return 'stable';
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) throw new Error('Tenant context not found');
    return tenantId;
  }
}
