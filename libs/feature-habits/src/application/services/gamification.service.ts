import { Injectable, Logger } from '@nestjs/common';
import { UserStatsRepository } from '../../infrastructure/repositories/user-stats.repository';
import { AchievementRepository } from '../../infrastructure/repositories/achievement.repository';
import { HabitRepository } from '../../infrastructure/repositories/habit.repository';
import { UserStatsEntity } from '../../domain/entities/user-stats.entity';
import { AchievementEntity, AchievementType } from '../../domain/entities/achievement.entity';
import { XP } from '../../domain/value-objects/xp.vo';
import { Level } from '../../domain/value-objects/level.vo';
import { getTenantId } from '@pms/data-access';

/** XP awarded per habit completion */
const XP_PER_COMPLETION = 10;

/** Streak achievement thresholds */
const STREAK_ACHIEVEMENTS: Array<{ type: AchievementType; threshold: number }> = [
  { type: 'STREAK_7', threshold: 7 },
  { type: 'STREAK_30', threshold: 30 },
  { type: 'STREAK_100', threshold: 100 },
];

/** Level achievement thresholds */
const LEVEL_ACHIEVEMENTS: Array<{ type: AchievementType; threshold: number }> = [
  { type: 'LEVEL_5', threshold: 5 },
  { type: 'LEVEL_10', threshold: 10 },
  { type: 'LEVEL_25', threshold: 25 },
];

export interface GamificationResult {
  xpEarned: number;
  newTotalXP: number;
  currentLevel: number;
  levelUp: boolean;
  newAchievements: AchievementEntity[];
  userStats: UserStatsEntity;
}

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly userStatsRepository: UserStatsRepository,
    private readonly achievementRepository: AchievementRepository,
    private readonly habitRepository: HabitRepository,
  ) {}

  /**
   * Award XP for completing a habit and check for achievements
   */
  async awardCompletionXP(
    habitId: string,
    currentStreak: number,
    longestStreak: number,
  ): Promise<GamificationResult> {
    const tenantId = this.getTenantId();

    // Get or create user stats
    let userStats = await this.userStatsRepository.findOrCreate(tenantId);

    // Award XP
    const xpAwarded = XP_PER_COMPLETION;
    userStats = await this.userStatsRepository.addXP(tenantId, xpAwarded);

    // Increment habits completed
    userStats = await this.userStatsRepository.incrementHabitsCompleted(tenantId);

    // Update longest streak if needed
    if (longestStreak > userStats.longestStreak) {
      userStats = await this.userStatsRepository.updateLongestStreak(tenantId, longestStreak);
    }

    // Check for level up
    const newLevel = Level.fromXP(XP.fromNumber(userStats.totalXP.value));
    const levelUp = newLevel.value > userStats.currentLevel.value;

    if (levelUp) {
      userStats = await this.userStatsRepository.updateLevel(tenantId, newLevel.value);
      this.logger.log(`User leveled up to ${newLevel.value}!`);
    }

    // Check for new achievements
    const newAchievements: AchievementEntity[] = [];

    // Check streak achievements
    for (const { type, threshold } of STREAK_ACHIEVEMENTS) {
      if (currentStreak >= threshold) {
        const existing = await this.achievementRepository.exists(tenantId, type, habitId);
        if (!existing) {
          const achievement = await this.achievementRepository.create({
            tenantId,
            userStatsId: userStats.id,
            type,
            habitId,
          });
          newAchievements.push(achievement);
          this.logger.log(`Achievement unlocked: ${type}`);
        }
      }
    }

    // Check level achievements
    for (const { type, threshold } of LEVEL_ACHIEVEMENTS) {
      if (newLevel.value >= threshold) {
        const existing = await this.achievementRepository.exists(tenantId, type);
        if (!existing) {
          const achievement = await this.achievementRepository.create({
            tenantId,
            userStatsId: userStats.id,
            type,
          });
          newAchievements.push(achievement);
          this.logger.log(`Achievement unlocked: ${type}`);
        }
      }
    }

    // Check for first completion achievement
    const firstCompletionExists = await this.achievementRepository.exists(
      tenantId,
      'FIRST_COMPLETION',
    );
    if (!firstCompletionExists) {
      const firstAchievement = await this.achievementRepository.create({
        tenantId,
        userStatsId: userStats.id,
        type: 'FIRST_COMPLETION',
      });
      newAchievements.push(firstAchievement);
      this.logger.log('Achievement unlocked: FIRST_COMPLETION');
    }

    return {
      xpEarned: xpAwarded,
      newTotalXP: userStats.totalXP.value,
      currentLevel: newLevel.value,
      levelUp,
      newAchievements,
      userStats,
    };
  }

  /**
   * Get gamification dashboard data
   */
  async getDashboard(): Promise<{
    stats: UserStatsEntity;
    recentAchievements: AchievementEntity[];
  }> {
    const tenantId = this.getTenantId();

    const stats = await this.userStatsRepository.findOrCreate(tenantId);
    const recentAchievements = await this.achievementRepository.findByTenantId(tenantId, {
      limit: 10,
    });

    return { stats, recentAchievements };
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
