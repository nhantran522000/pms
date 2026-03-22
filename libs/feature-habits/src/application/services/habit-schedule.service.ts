import { Injectable, Logger } from '@nestjs/common';
import { HabitRepository } from '../../infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from '../../infrastructure/repositories/habit-completion.repository';
import { CronParserService } from '../../infrastructure/services/cron-parser.service';
import { HabitEntity } from '../../domain/entities/habit.entity';
import { getTenantId } from '@pms/data-access';

export interface HabitWithCompletionStatus extends HabitEntity {
  completedToday: boolean;
  completionId?: string;
}

@Injectable()
export class HabitScheduleService {
  private readonly logger = new Logger(HabitScheduleService.name);

  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitCompletionRepository: HabitCompletionRepository,
    private readonly cronParser: CronParserService,
  ) {}

  /**
   * Get habits scheduled for today with completion status
   */
  async getHabitsForToday(): Promise<HabitWithCompletionStatus[]> {
    const tenantId = this.getTenantId();
    const today = new Date();
    const allHabits = await this.habitRepository.findAll(tenantId, {
      isActive: true,
    });

    // Filter habits scheduled for today
    const scheduledToday = allHabits.filter((habit) =>
      this.isHabitScheduledForDate(habit, today),
    );

    // Get today's completions for these habits
    const completions =
      await this.habitCompletionRepository.findByHabitAndDateRange(
        tenantId,
        scheduledToday.map((h) => h.id),
        today,
        today,
      );

    const completionMap = new Map(completions.map((c) => [c.habitId, c]));

    // Add completion status to each habit
    return scheduledToday.map((habit) => {
      const completion = completionMap.get(habit.id);
      return {
        ...habit,
        completedToday: completion?.completed ?? false,
        completionId: completion?.id,
      };
    });
  }

  /**
   * Get habits scheduled for a specific date
   */
  async getHabitsForDate(date: Date): Promise<HabitWithCompletionStatus[]> {
    const tenantId = this.getTenantId();
    const allHabits = await this.habitRepository.findAll(tenantId, {
      isActive: true,
    });

    const scheduledForDate = allHabits.filter((habit) =>
      this.isHabitScheduledForDate(habit, date),
    );

    const completions =
      await this.habitCompletionRepository.findByHabitAndDateRange(
        tenantId,
        scheduledForDate.map((h) => h.id),
        date,
        date,
      );

    const completionMap = new Map(completions.map((c) => [c.habitId, c]));

    return scheduledForDate.map((habit) => {
      const completion = completionMap.get(habit.id);
      return {
        ...habit,
        completedToday: completion?.completed ?? false,
        completionId: completion?.id,
      };
    });
  }

  /**
   * Check if a habit is scheduled for a specific date
   */
  private isHabitScheduledForDate(habit: HabitEntity, date: Date): boolean {
    // Daily habits are always scheduled
    if (habit.frequency === 'daily') {
      return true;
    }

    // Weekly habits - scheduled on the same day of week as created
    if (habit.frequency === 'weekly') {
      const createdDay = new Date(habit.createdAt).getDay();
      return date.getDay() === createdDay;
    }

    // Custom frequency - use cron expression
    if (habit.frequency === 'custom' && habit.cronExpression) {
      return this.cronParser.isScheduledForDate(habit.cronExpression, date);
    }

    return false;
  }

  /**
   * Get upcoming scheduled dates for a habit
   */
  async getUpcomingSchedule(
    habitId: string,
    count: number = 10,
  ): Promise<Date[]> {
    const tenantId = this.getTenantId();

    const habit = await this.habitRepository.findById(habitId, tenantId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.frequency === 'daily') {
      return this.generateDailyDates(count);
    }

    if (habit.frequency === 'weekly') {
      return this.generateWeeklyDates(habit.createdAt, count);
    }

    if (habit.frequency === 'custom' && habit.cronExpression) {
      return this.cronParser.getNextScheduledDates(habit.cronExpression, count);
    }

    return [];
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }

  private generateDailyDates(count: number): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  private generateWeeklyDates(createdAt: Date, count: number): Date[] {
    const dates: Date[] = [];
    const targetDay = new Date(createdAt).getDay();
    const today = new Date();

    for (let i = 0; i < count * 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      if (date.getDay() === targetDay) {
        dates.push(date);
        if (dates.length >= count) break;
      }
    }

    return dates;
  }
}
