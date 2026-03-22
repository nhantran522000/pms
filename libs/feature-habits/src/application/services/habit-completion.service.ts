import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { HabitRepository } from '../../infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from '../../infrastructure/repositories/habit-completion.repository';
import { HabitEntity } from '../../domain/entities/habit.entity';
import { HabitCompletionEntity } from '../../domain/entities/habit-completion.entity';
import { CheckInHabitDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HabitCompletionService {
  private readonly logger = new Logger(HabitCompletionService.name);

  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly completionRepository: HabitCompletionRepository,
  ) {}

  async checkIn(
    habitId: string,
    dto: CheckInHabitDto,
  ): Promise<HabitCompletionEntity> {
    const tenantId = this.getTenantId();

    // Verify habit exists
    const habit = await this.habitRepository.findById(habitId, tenantId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Determine the date for check-in (default to today)
    const checkInDate = dto.date ? new Date(dto.date) : new Date();
    // Normalize to start of day
    checkInDate.setHours(0, 0, 0, 0);

    // Check if already checked in for this date
    const existingCompletion = await this.completionRepository.findByHabitAndDate(
      habitId,
      tenantId,
      checkInDate,
    );

    if (existingCompletion) {
      throw new BadRequestException(
        'Already checked in for this date. Use update instead.',
      );
    }

    // Create completion record
    const completion = await this.completionRepository.create({
      tenantId,
      habitId,
      date: checkInDate,
      completed: dto.completed ?? true,
      notes: dto.notes ?? null,
    });

    // Calculate and update streaks
    const { currentStreak, longestStreak } = await this.calculateStreak(
      habitId,
      checkInDate,
      dto.completed ?? true,
    );

    await this.habitRepository.updateStreaks(
      habitId,
      tenantId,
      currentStreak,
      longestStreak,
    );

    this.logger.log(
      `Check-in created for habit ${habitId} on ${checkInDate.toDateString()}, streak: ${currentStreak}`,
    );

    return completion;
  }

  async getCompletions(
    habitId: string,
    options?: { startDate?: Date; endDate?: Date },
  ): Promise<HabitCompletionEntity[]> {
    const tenantId = this.getTenantId();

    // Verify habit exists
    const habit = await this.habitRepository.findById(habitId, tenantId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.completionRepository.findByHabit(habitId, tenantId, options);
  }

  async calculateStreak(habitId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
  }> {
    const tenantId = this.getTenantId();

    // Verify habit exists
    const habit = await this.habitRepository.findById(habitId, tenantId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.calculateStreakFromCompletions(habitId, tenantId);
  }

  /**
   * Calculate streak for a specific check-in date
   * This is called during check-in to update streaks immediately
   */
  private async calculateStreak(
    habitId: string,
    checkInDate: Date,
    wasCompleted: boolean,
  ): Promise<{ currentStreak: number; longestStreak: number }> {
    const tenantId = this.getTenantId();
    const habit = await this.habitRepository.findById(habitId, tenantId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // If check-in was not completed, streak resets to 0
    if (!wasCompleted) {
      return {
        currentStreak: 0,
        longestStreak: habit.longestStreak, // Preserve longest
      };
    }

    // Get all completions before this check-in
    const previousCompletions =
      await this.completionRepository.getAllCompletionsOrdered(
        habitId,
        tenantId,
      );

    // Calculate new streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDateOnly = new Date(checkInDate);
    checkInDateOnly.setHours(0, 0, 0, 0);

    // Start counting from check-in date
    let currentStreak = 1;
    let checkDate = new Date(checkInDateOnly);
    checkDate.setDate(checkDate.getDate() - 1); // Start from day before

    // Count consecutive completed days
    for (const completion of previousCompletions) {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);

      // Check if this completion is for the expected previous day
      if (completionDate.getTime() === checkDate.getTime() && completion.completed) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (completionDate.getTime() < checkDate.getTime()) {
        // Gap found, stop counting
        break;
      }
      // If completion is for a later date, skip it (shouldn't happen with ordered query)
    }

    const longestStreak = Math.max(currentStreak, habit.longestStreak);

    return { currentStreak, longestStreak };
  }

  /**
   * Calculate streak from all completions (for retrieval)
   */
  private async calculateStreakFromCompletions(
    habitId: string,
    tenantId: string,
  ): Promise<{ currentStreak: number; longestStreak: number }> {
    const habit = await this.habitRepository.findById(habitId, tenantId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Get all completions ordered by date descending
    const completions =
      await this.completionRepository.getAllCompletionsOrdered(
        habitId,
        tenantId,
      );

    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: habit.longestStreak };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the most recent completion date
    const mostRecent = new Date(completions[0].date);
    mostRecent.setHours(0, 0, 0, 0);

    // If most recent is before yesterday, streak is broken
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (mostRecent.getTime() < yesterday.getTime()) {
      return { currentStreak: 0, longestStreak: habit.longestStreak };
    }

    // Count consecutive days starting from most recent
    let currentStreak = 0;
    let expectedDate = new Date(
      mostRecent.getTime() >= today.getTime() ? today : mostRecent,
    );

    for (const completion of completions) {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);

      if (completionDate.getTime() === expectedDate.getTime() && completion.completed) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (completionDate.getTime() < expectedDate.getTime()) {
        // Gap found
        break;
      }
    }

    const longestStreak = Math.max(currentStreak, habit.longestStreak);

    return { currentStreak, longestStreak };
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
