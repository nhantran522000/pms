import { HabitCompletion } from '@prisma/client';

export class HabitCompletionEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly habitId: string,
    public readonly date: Date,
    public readonly completed: boolean,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(completion: HabitCompletion): HabitCompletionEntity {
    return new HabitCompletionEntity(
      completion.id,
      completion.tenantId,
      completion.habitId,
      completion.date,
      completion.completed,
      completion.notes,
      completion.createdAt,
      completion.updatedAt,
    );
  }

  /**
   * Check if this completion was for a specific date
   */
  isForDate(date: Date): boolean {
    return this.date.toDateString() === date.toDateString();
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      habitId: this.habitId,
      date: this.date,
      completed: this.completed,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
