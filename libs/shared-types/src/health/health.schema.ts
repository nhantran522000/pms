import { z } from 'zod';

// Health log types
export const HealthLogTypeSchema = z.enum([
  'WEIGHT',
  'BLOOD_PRESSURE',
  'HEART_RATE',
  'SLEEP',
  'WORKOUT',
]);
export type HealthLogType = z.infer<typeof HealthLogTypeSchema>;

// Type-specific data schemas
export const WeightDataSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['kg', 'lbs']),
});
export type WeightData = z.infer<typeof WeightDataSchema>;

export const BloodPressureDataSchema = z.object({
  systolic: z.number().int().min(60).max(250),
  diastolic: z.number().int().min(40).max(150),
});
export type BloodPressureData = z.infer<typeof BloodPressureDataSchema>;

export const HeartRateDataSchema = z.object({
  bpm: z.number().int().min(30).max(220),
});
export type HeartRateData = z.infer<typeof HeartRateDataSchema>;

export const SleepDataSchema = z.object({
  durationMinutes: z.number().int().min(0).max(1440),
  quality: z.number().int().min(1).max(5),
});
export type SleepData = z.infer<typeof SleepDataSchema>;

export const WorkoutDataSchema = z.object({
  type: z.string().max(100),
  durationMinutes: z.number().int().min(0),
  intensity: z.enum(['low', 'moderate', 'high']),
  caloriesBurned: z.number().int().min(0).optional(),
});
export type WorkoutData = z.infer<typeof WorkoutDataSchema>;

// Create health log schema
export const CreateHealthLogSchema = z.object({
  type: HealthLogTypeSchema,
  loggedAt: z.string().datetime().or(z.date()),
  data: z.record(z.string(), z.unknown()),
  notes: z.string().max(1000).optional(),
  source: z.string().max(50).default('manual'),
});
export type CreateHealthLogDto = z.infer<typeof CreateHealthLogSchema>;

// Update health log schema
export const UpdateHealthLogSchema = z.object({
  loggedAt: z.string().datetime().or(z.date()).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(1000).optional(),
});
export type UpdateHealthLogDto = z.infer<typeof UpdateHealthLogSchema>;

// Health log response
export const HealthLogResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  type: HealthLogTypeSchema,
  loggedAt: z.date(),
  data: z.record(z.string(), z.unknown()),
  notes: z.string().nullable(),
  source: z.string(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type HealthLogResponse = z.infer<typeof HealthLogResponseSchema>;

// Trend query schema
export const TrendQuerySchema = z.object({
  type: HealthLogTypeSchema,
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  range: z.enum(['30', '90', '365']).optional(),
});
export type TrendQuery = z.infer<typeof TrendQuerySchema>;

// Trend data point schema
export const TrendDataPointSchema = z.object({
  x: z.number(), // timestamp
  y: z.number(), // value
  date: z.date(),
  notes: z.string().nullable(),
});
export type TrendDataPoint = z.infer<typeof TrendDataPointSchema>;

// Trend data response
export const TrendDataSchema = z.object({
  type: HealthLogTypeSchema,
  data: z.array(TrendDataPointSchema),
  startDate: z.date(),
  endDate: z.date(),
});
export type TrendData = z.infer<typeof TrendDataSchema>;

// Sleep-specific schemas
export const LogSleepSchema = z.object({
  durationMinutes: z.number().int().min(0).max(1440),
  quality: z.number().int().min(1).max(5),
  loggedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional(),
  source: z.string().max(50).default('manual'),
});
export type LogSleepDto = z.infer<typeof LogSleepSchema>;

export const SleepHistoryQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
export type SleepHistoryQuery = z.infer<typeof SleepHistoryQuerySchema>;

export const SleepTrendQuerySchema = z.object({
  range: z.enum(['30', '90', '365']).default('30'),
});
export type SleepTrendQuery = z.infer<typeof SleepTrendQuerySchema>;

export const SleepStatsQuerySchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});
export type SleepStatsQuery = z.infer<typeof SleepStatsQuerySchema>;

// Workout-specific schemas
export const LogWorkoutSchema = z.object({
  type: z.string().min(1).max(100),
  durationMinutes: z.number().int().min(0),
  intensity: z.enum(['low', 'moderate', 'high']),
  caloriesBurned: z.number().int().min(0).optional(),
  loggedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional(),
  source: z.string().max(50).default('manual'),
});
export type LogWorkoutDto = z.infer<typeof LogWorkoutSchema>;

export const WorkoutHistoryQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  type: z.string().max(100).optional(),
});
export type WorkoutHistoryQuery = z.infer<typeof WorkoutHistoryQuerySchema>;

export const WorkoutTrendQuerySchema = z.object({
  range: z.enum(['30', '90', '365']).default('30'),
});
export type WorkoutTrendQuery = z.infer<typeof WorkoutTrendQuerySchema>;

export const WorkoutStatsQuerySchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});
export type WorkoutStatsQuery = z.infer<typeof WorkoutStatsQuerySchema>;
