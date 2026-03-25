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
  context: z.record(z.string(), z.unknown()).optional(),
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

// Task-specific result types
export interface ClassifyResult {
  category: string;
  confidence: number; // 0-1
  alternatives?: Array<{ category: string; confidence: number }>;
}

export interface LabelResult {
  labels: string[];
  confidence: Record<string, number>;
}

export interface SummarizeResult {
  summary: string;
  keyPoints?: string[];
  wordCount: number;
}

export interface AnalyzeResult {
  insights: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  themes?: string[];
  recommendations?: string[];
}

export interface ExtractResult {
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  metadata?: Record<string, unknown>;
}

export interface ChatResult {
  response: string;
  followUpQuestions?: string[];
  contextUsed?: boolean;
}

// Union type for all results
export type TaskResult =
  | ClassifyResult
  | LabelResult
  | SummarizeResult
  | AnalyzeResult
  | ExtractResult
  | ChatResult;

// Extended AiResponse with parsed result
export interface AiResponseWithResult extends AiResponse {
  result?: TaskResult;
}

// Zod schemas for validation
export const ClassifyResultSchema = z.object({
  category: z.string(),
  confidence: z.number().min(0).max(1),
  alternatives: z.array(z.object({
    category: z.string(),
    confidence: z.number(),
  })).optional(),
});

export const LabelResultSchema = z.object({
  labels: z.array(z.string()),
  confidence: z.record(z.string(), z.number()),
});

export const SummarizeResultSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()).optional(),
  wordCount: z.number(),
});

export const AnalyzeResultSchema = z.object({
  insights: z.array(z.string()),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  themes: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

export const ExtractResultSchema = z.object({
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
    confidence: z.number(),
  })),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ChatResultSchema = z.object({
  response: z.string(),
  followUpQuestions: z.array(z.string()).optional(),
  contextUsed: z.boolean().optional(),
});
