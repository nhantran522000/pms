import { Injectable, Logger } from '@nestjs/common';
import * as cronParser from 'cron-parser';

@Injectable()
export class CronParserService {
  private readonly logger = new Logger(CronParserService.name);

  /**
   * Parse a cron expression and check if a date matches
   */
  isScheduledForDate(cronExpression: string, date: Date): boolean {
    try {
      const interval = cronParser.parseExpression(cronExpression, {
        currentDate: this.getStartOfDay(date),
        endDate: this.getEndOfDay(date),
      });
      return interval.hasNext();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Invalid cron expression "${cronExpression}": ${errorMessage}`);
      return false;
    }
  }

  /**
   * Get next scheduled dates from a cron expression
   */
  getNextScheduledDates(cronExpression: string, count: number = 10): Date[] {
    try {
      const interval = cronParser.parseExpression(cronExpression);
      const dates: Date[] = [];
      for (let i = 0; i < count; i++) {
        dates.push(interval.next().toDate());
      }
      return dates;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to parse cron expression "${cronExpression}": ${errorMessage}`);
      return [];
    }
  }

  /**
   * Validate a cron expression
   */
  isValidCronExpression(expression: string): boolean {
    try {
      cronParser.parseExpression(expression);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Convert natural language to cron expression
   */
  naturalLanguageToCron(input: string): string | null {
    const normalized = input.toLowerCase().trim();

    const mappings: Record<string, string> = {
      daily: '0 9 * * *',
      'every day': '0 9 * * *',
      weekly: '0 9 * * 1',
      'every week': '0 9 * * 1',
      weekdays: '0 9 * * 1-5',
      weekends: '0 9 * * 0,6',
      'every mon,wed,fri': '0 9 * * 1,3,5',
      'every tue,thu': '0 9 * * 2,4',
    };

    // Check direct mappings
    if (mappings[normalized]) {
      return mappings[normalized];
    }

    // Parse "every N weeks" pattern
    const weeksMatch = normalized.match(/every (\d+) weeks?/);
    if (weeksMatch) {
      return `0 9 * * 1/${weeksMatch[1]}`;
    }

    // If already a valid cron, return as-is
    if (this.isValidCronExpression(input)) {
      return input;
    }

    return null;
  }

  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getEndOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
