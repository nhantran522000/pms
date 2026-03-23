import { Injectable, NotFoundException } from '@nestjs/common';
import { HabitRepository } from '../../infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from '../../infrastructure/repositories/habit-completion.repository';
import { HabitEntity } from '../../domain/entities/habit.entity';
import { getTenantId } from '@pms/data-access';
import {
  CalendarDay,
  CalendarStats,
  HabitCalendarResponse,
} from '@pms/shared-types';

@Injectable()
export class HabitCalendarService {
  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitCompletionRepository: HabitCompletionRepository,
  ) {}

  async getCalendar(habitId: string, month?: string): Promise<HabitCalendarResponse> {
    const tenantId = this.getTenantId();

    // Get habit
    const habit = await this.habitRepository.findById(habitId, tenantId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Parse month or use current
    let year: number;
    let monthNum: number;

    if (month) {
      const parts = month.split('-');
      year = parseInt(parts[0], 10);
      monthNum = parseInt(parts[1], 10);
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNum = now.getMonth() + 1;
    }

    // Get completions for the month
    const completionsMap = await this.habitCompletionRepository.getCompletionsByMonth(
      habitId,
      tenantId,
      year,
      monthNum,
    );

    // Generate calendar days
    const days = this.generateCalendarDays(year, monthNum, habit, completionsMap);

    // Calculate stats
    const stats = this.calculateStats(days, habit);

    return {
      habitId: habit.id,
      habitName: habit.name,
      frequency: habit.frequency,
      month: `${year}-${String(monthNum).padStart(2, '0')}`,
      year,
      monthNumber: monthNum,
      days,
      stats,
    };
  }

  private generateCalendarDays(
    year: number,
    month: number,
    habit: HabitEntity,
    completionsMap: Map<string, { id: string; completed: boolean; notes?: string | null }>,
  ): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateKey = date.toISOString().split('T')[0];
      const completion = completionsMap.get(dateKey);

      const isScheduled = this.isScheduledForDate(habit, date);
      const isCompleted = completion?.completed ?? false;

      days.push({
        date: dateKey,
        dayOfWeek: date.getDay(),
        isScheduled,
        isCompleted,
        isToday: date.getTime() === today.getTime(),
        isPast: date < today,
        isFuture: date > today,
        completionId: completion?.id ?? null,
        notes: completion?.notes ?? null,
      });
    }

    return days;
  }

  private isScheduledForDate(habit: HabitEntity, date: Date): boolean {
    // Habits can only be scheduled after their creation date
    const createdDate = new Date(habit.createdAt);
    createdDate.setHours(0, 0, 0, 0);
    if (date < createdDate) {
      return false;
    }

    if (habit.frequency === 'daily') {
      return true;
    }

    if (habit.frequency === 'weekly') {
      // Scheduled on the same day of week as creation
      const createdDay = createdDate.getDay();
      return date.getDay() === createdDay;
    }

    if (habit.frequency === 'custom') {
      // For custom frequency, assume all days are scheduled
      // In a full implementation, this would use the cron expression
      return true;
    }

    return false;
  }

  private calculateStats(days: CalendarDay[], habit: HabitEntity): CalendarStats {
    const scheduledDays = days.filter((d) => d.isScheduled && d.isPast);
    const completedDays = scheduledDays.filter((d) => d.isCompleted);
    const missedDays = scheduledDays.filter((d) => !d.isCompleted);

    const completionRate =
      scheduledDays.length > 0
        ? Math.round((completedDays.length / scheduledDays.length) * 100)
        : 0;

    // Calculate current streak from the end of the month backwards
    // Only count past scheduled days
    let currentStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (!day.isPast) continue;
      if (!day.isScheduled) continue;
      if (day.isCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalDays: days.length,
      scheduledDays: scheduledDays.length,
      completedDays: completedDays.length,
      missedDays: missedDays.length,
      completionRate,
      currentStreak,
      longestStreak: habit.longestStreak,
    };
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
