import { z } from 'zod';

// Frequency types
export const HabitFrequencySchema = z.enum(['daily', 'weekly', 'custom']);
export type HabitFrequency = z.infer<typeof HabitFrequencySchema>;

// Create Habit
export const CreateHabitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  frequency: HabitFrequencySchema,
  cronExpression: z.string().optional(), // For custom frequency
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
});
export type CreateHabitDto = z.infer<typeof CreateHabitSchema>;

// Update Habit
export const UpdateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  frequency: HabitFrequencySchema.optional(),
  cronExpression: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateHabitDto = z.infer<typeof UpdateHabitSchema>;

// Habit response
export const HabitResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  frequency: HabitFrequencySchema,
  cronExpression: z.string().nullable(),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  isActive: z.boolean(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type HabitResponse = z.infer<typeof HabitResponseSchema>;

// Check-in request
export const CheckInHabitSchema = z.object({
  date: z.string().date().optional(), // Defaults to today
  completed: z.boolean().default(true),
  notes: z.string().max(200).optional(),
});
export type CheckInHabitDto = z.infer<typeof CheckInHabitSchema>;

// Habit completion response
export const HabitCompletionResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  habitId: z.string(),
  date: z.date(),
  completed: z.boolean(),
  notes: z.string().nullable(),
  createdAt: z.date(),
});
export type HabitCompletionResponse = z.infer<typeof HabitCompletionResponseSchema>;

// Streak info response
export const StreakInfoSchema = z.object({
  currentStreak: z.number(),
  longestStreak: z.number(),
});
export type StreakInfo = z.infer<typeof StreakInfoSchema>;

// Habit with completion status for daily view
export const HabitWithCompletionSchema = HabitResponseSchema.extend({
  completedToday: z.boolean(),
  completionId: z.string().nullable().optional(),
});
export type HabitWithCompletion = z.infer<typeof HabitWithCompletionSchema>;

// Today's habits response
export const TodayHabitsResponseSchema = z.object({
  habits: z.array(HabitWithCompletionSchema),
  date: z.string(),
  total: z.number(),
  completed: z.number(),
});
export type TodayHabitsResponse = z.infer<typeof TodayHabitsResponseSchema>;

// Calendar day data
export const CalendarDaySchema = z.object({
  date: z.string(), // ISO date string "2024-01-15"
  dayOfWeek: z.number(), // 0-6 (Sunday-Saturday)
  isScheduled: z.boolean(), // Is habit scheduled for this day?
  isCompleted: z.boolean(), // Was it completed?
  isToday: z.boolean(), // Is this today?
  isPast: z.boolean(), // Is this in the past?
  isFuture: z.boolean(), // Is this in the future?
  completionId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type CalendarDay = z.infer<typeof CalendarDaySchema>;

// Calendar stats
export const CalendarStatsSchema = z.object({
  totalDays: z.number(),
  scheduledDays: z.number(),
  completedDays: z.number(),
  missedDays: z.number(),
  completionRate: z.number(), // 0-100 percentage
  currentStreak: z.number(),
  longestStreak: z.number(),
});
export type CalendarStats = z.infer<typeof CalendarStatsSchema>;

// Habit calendar response
export const HabitCalendarResponseSchema = z.object({
  habitId: z.string(),
  habitName: z.string(),
  frequency: HabitFrequencySchema,
  month: z.string(), // "2024-01"
  year: z.number(),
  monthNumber: z.number(), // 1-12
  days: z.array(CalendarDaySchema),
  stats: CalendarStatsSchema,
});
export type HabitCalendarResponse = z.infer<typeof HabitCalendarResponseSchema>;

// Calendar query params
export const CalendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(), // "2024-01"
});
export type CalendarQuery = z.infer<typeof CalendarQuerySchema>;
