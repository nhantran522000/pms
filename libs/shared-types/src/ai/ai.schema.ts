import { z } from 'zod';

// Task types supported by AI Gateway
export const AI_TASK_TYPES = ['CLASSIFY', 'LABEL', 'SUMMARIZE', 'ANALYZE', 'EXTRACT', 'CHAT'] as const;
export type AiTaskType = typeof AI_TASK_TYPES[number];

// AI providers
export const AI_PROVIDERS = ['groq', 'gemini'] as const;
export type AiProvider = typeof AI_PROVIDERS[number];

// AI Request schema
export const AiRequestSchema = z.object({
  taskType: z.enum(AI_TASK_TYPES),
  prompt: z.string().min(1).max(10000),
  context: z.record(z.unknown()).optional(),
  maxTokens: z.number().int().min(1).max(32000).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

// AI Response schema
export const AiResponseSchema = z.object({
  success: z.boolean(),
  content: z.string(),
  provider: z.enum(AI_PROVIDERS),
  model: z.string(),
  inputTokens: z.number().int(),
  outputTokens: z.number().int(),
  latencyMs: z.number().int(),
  cached: z.boolean().optional(),
  error: z.string().optional(),
});

// Export inferred types
export type AiRequest = z.infer<typeof AiRequestSchema>;
export type AiResponse = z.infer<typeof AiResponseSchema>;

// Interface definitions for TypeScript
export interface AiRequestInterface {
  taskType: AiTaskType;
  prompt: string;
  context?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

export interface AiResponseInterface {
  success: boolean;
  content: string;
  provider: AiProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  cached?: boolean;
  error?: string;
}
