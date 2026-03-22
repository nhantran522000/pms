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
