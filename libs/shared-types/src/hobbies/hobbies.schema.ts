import { z } from 'zod';

// Hobby tracking types
export const HobbyTrackingTypeSchema = z.enum(['COUNTER', 'PERCENTAGE', 'LIST']);
export type HobbyTrackingType = z.infer<typeof HobbyTrackingTypeSchema>;

// Type-specific log value schemas
export const CounterLogValueSchema = z.object({
  increment: z.number().positive().default(1),
});
export type CounterLogValue = z.infer<typeof CounterLogValueSchema>;

export const PercentageLogValueSchema = z.object({
  percentage: z.number().min(0).max(100),
});
export type PercentageLogValue = z.infer<typeof PercentageLogValueSchema>;

export const ListLogValueSchema = z.object({
  label: z.string().max(200),
});
export type ListLogValue = z.infer<typeof ListLogValueSchema>;

// Create hobby schema
export const CreateHobbySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  trackingType: HobbyTrackingTypeSchema,
  goalTarget: z.number().positive().optional(),
  goalDeadline: z.string().datetime().or(z.date()).optional(),
});
export type CreateHobbyDto = z.infer<typeof CreateHobbySchema>;

// Update hobby schema
export const UpdateHobbySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  goalTarget: z.number().positive().nullable().optional(),
  goalDeadline: z.string().datetime().or(z.date()).nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateHobbyDto = z.infer<typeof UpdateHobbySchema>;

// Hobby response schema
export const HobbyResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  trackingType: HobbyTrackingTypeSchema,
  goalTarget: z.number().nullable(),
  goalDeadline: z.date().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type HobbyResponse = z.infer<typeof HobbyResponseSchema>;

// Create hobby log schema
export const CreateHobbyLogSchema = z.object({
  hobbyId: z.string(),
  logValue: z.record(z.string(), z.unknown()),
  loggedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(500).optional(),
});
export type CreateHobbyLogDto = z.infer<typeof CreateHobbyLogSchema>;

// Hobby log response schema
export const HobbyLogResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  hobbyId: z.string(),
  trackingType: HobbyTrackingTypeSchema,
  logValue: z.record(z.string(), z.unknown()),
  loggedAt: z.date(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type HobbyLogResponse = z.infer<typeof HobbyLogResponseSchema>;

// Hobby with completion percentage (for dashboard)
export const HobbyWithCompletionSchema = HobbyResponseSchema.extend({
  currentTotal: z.number(),
  completionPercentage: z.number().min(0).max(100),
});
export type HobbyWithCompletion = z.infer<typeof HobbyWithCompletionSchema>;

// Hobby trend query schema
export const HobbyTrendQuerySchema = z.object({
  hobbyId: z.string(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  range: z.enum(['7', '30', '90', '365']).optional(),
});
export type HobbyTrendQuery = z.infer<typeof HobbyTrendQuerySchema>;

// Trend data point schema (consistent with health module)
export const HobbyTrendDataPointSchema = z.object({
  x: z.number(), // timestamp
  y: z.number(), // value
  date: z.date(),
  notes: z.string().nullable(),
});
export type HobbyTrendDataPoint = z.infer<typeof HobbyTrendDataPointSchema>;

// Counter chart data (bars + running total line)
export const CounterChartDataSchema = z.object({
  bars: z.array(HobbyTrendDataPointSchema),
  line: z.array(HobbyTrendDataPointSchema),
});
export type CounterChartData = z.infer<typeof CounterChartDataSchema>;

// Hobby trend data response
export const HobbyTrendDataSchema = z.object({
  hobbyId: z.string(),
  trackingType: HobbyTrackingTypeSchema,
  data: z.union([CounterChartDataSchema, z.array(HobbyTrendDataPointSchema)]),
  startDate: z.date(),
  endDate: z.date(),
});
export type HobbyTrendData = z.infer<typeof HobbyTrendDataSchema>;

// Hobby insights schema (AI-generated)
export const HobbyInsightsSchema = z.object({
  hobbyId: z.string(),
  hobbyName: z.string(),
  summary: z.string(),
  trends: z.array(z.string()),
  consistencyStreaks: z.array(z.string()),
  goalTrajectory: z.array(z.string()),
  milestones: z.array(z.string()),
  generatedAt: z.date(),
  isDataOnly: z.boolean(),
});
export type HobbyInsights = z.infer<typeof HobbyInsightsSchema>;
