import { z } from 'zod';

// API Response format (per CONTEXT.md decision)
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }).optional(),
  meta: z.object({
    total: z.number().optional(),
    cursor: z.string().optional(),
    limit: z.number().optional(),
  }).optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    cursor?: string;
    limit?: number;
  };
};

// Cursor pagination (per CONTEXT.md decision)
export const CursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

export type CursorPagination = z.infer<typeof CursorPaginationSchema>;
