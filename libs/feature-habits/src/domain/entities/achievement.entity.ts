import { Achievement as PrismaAchievement } from '@prisma/client';

export type AchievementType =
  | 'FIRST_COMPLETION'
  | 'STREAK_7'
  | 'STREAK_30'
  | 'STREAK_100'
  | 'LEVEL_5'
  | 'LEVEL_10'
  | 'LEVEL_25';

export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementType,
  { name: string; description: string; icon: string }
> = {
  FIRST_COMPLETION: {
    name: 'First Step',
    description: 'Complete your first habit',
    icon: '🎯',
  },
  STREAK_7: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
  },
  STREAK_30: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
  },
  STREAK_100: {
    name: 'Century Champion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
  },
  LEVEL_5: {
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '🌟',
  },
  LEVEL_10: {
    name: 'Habit Hero',
    description: 'Reach level 10',
    icon: '🏅',
  },
  LEVEL_25: {
    name: 'Legend',
    description: 'Reach level 25',
    icon: '💎',
  },
};

/**
 * Achievement Entity - Unlocked achievements for gamification
 */
export class AchievementEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly type: AchievementType,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string | null,
    public readonly unlockedAt: Date,
    public readonly habitId: string | null,
  ) {}

  static fromPrisma(achievement: PrismaAchievement): AchievementEntity {
    return new AchievementEntity(
      achievement.id,
      achievement.tenantId,
      achievement.type as AchievementType,
      achievement.name,
      achievement.description,
      achievement.icon,
      achievement.unlockedAt,
      achievement.habitId,
    );
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      type: this.type,
      name: this.name,
      description: this.description,
      icon: this.icon,
      unlockedAt: this.unlockedAt,
      habitId: this.habitId,
    };
  }
}
