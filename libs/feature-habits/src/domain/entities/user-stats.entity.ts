import { UserStats } from '@prisma/client';
import { XP } from '../value-objects/xp.vo';
import { Level } from '../value-objects/level.vo';

/**
 * UserStats Entity - Gamification statistics per tenant
 */
export class UserStatsEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly totalXP: XP,
    public readonly currentLevel: Level,
    public readonly habitsCompleted: number,
    public readonly longestStreak: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(stats: UserStats): UserStatsEntity {
    return new UserStatsEntity(
      stats.id,
      stats.tenantId,
      XP.fromNumber(stats.totalXP),
      Level.fromNumber(stats.currentLevel),
      stats.habitsCompleted,
      stats.longestStreak,
      stats.createdAt,
      stats.updatedAt,
    );
  }

  get xpProgress(): number {
    return this.totalXP.progressToNextLevel();
  }

  xpToNextLevel(): number {
    return this.currentLevel.xpToNextLevel(this.totalXP);
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      totalXP: this.totalXP.value,
      currentLevel: this.currentLevel.value,
      xpProgress: this.xpProgress,
      xpToNextLevel: this.xpToNextLevel(),
      habitsCompleted: this.habitsCompleted,
      longestStreak: this.longestStreak,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
