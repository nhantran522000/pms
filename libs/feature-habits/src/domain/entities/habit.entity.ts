import { Habit } from '@prisma/client';
import { HabitFrequency } from '@pms/shared-types';

export class HabitEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly frequency: HabitFrequency,
    public readonly cronExpression: string | null,
    public readonly color: string | null,
    public readonly icon: string | null,
    public readonly isActive: boolean,
    public readonly currentStreak: number,
    public readonly longestStreak: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(habit: Habit): HabitEntity {
    return new HabitEntity(
      habit.id,
      habit.tenantId,
      habit.name,
      habit.description,
      habit.frequency as HabitFrequency,
      habit.cronExpression,
      habit.color,
      habit.icon,
      habit.isActive,
      habit.currentStreak,
      habit.longestStreak,
      habit.createdAt,
      habit.updatedAt,
    );
  }

  /**
   * Update streak values
   */
  updateStreaks(currentStreak: number, longestStreak: number): HabitEntity {
    return new HabitEntity(
      this.id,
      this.tenantId,
      this.name,
      this.description,
      this.frequency,
      this.cronExpression,
      this.color,
      this.icon,
      this.isActive,
      currentStreak,
      longestStreak,
      this.createdAt,
      this.updatedAt,
    );
  }

  /**
   * Check if habit is active
   */
  isArchived(): boolean {
    return !this.isActive;
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      description: this.description,
      frequency: this.frequency,
      cronExpression: this.cronExpression,
      color: this.color,
      icon: this.icon,
      isActive: this.isActive,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
