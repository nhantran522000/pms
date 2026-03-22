import { z } from 'zod';

// Priority levels
export const TaskPrioritySchema = z.number().int().min(1).max(4);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
};

// Create Task
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().or(z.date()).optional().nullable(),
  priority: TaskPrioritySchema.default(2),
  tags: z.array(z.string().max(50)).default([]),
  parentId: z.string().cuid().optional().nullable(),
});
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

// Update Task
export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().or(z.date()).nullable().optional(),
  priority: TaskPrioritySchema.optional(),
  tags: z.array(z.string().max(50)).optional(),
});
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;

// Task response
export const TaskResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  parentId: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.date().nullable(),
  priority: z.number(),
  tags: z.array(z.string()),
  isCompleted: z.boolean(),
  completedAt: z.date().nullable(),
  isOverdue: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TaskResponse = z.infer<typeof TaskResponseSchema>;

// Task with subtasks
export const TaskWithSubtasksSchema: z.ZodType<TaskWithSubtasks> = z.lazy(() =>
  TaskResponseSchema.extend({
    subtasks: z.array(TaskWithSubtasksSchema).optional(),
  })
);
export type TaskWithSubtasks = {
  id: string;
  tenantId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number;
  tags: string[];
  isCompleted: boolean;
  completedAt: Date | null;
  isOverdue: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  subtasks?: TaskWithSubtasks[];
};

// Mark complete/incomplete
export const MarkCompleteSchema = z.object({
  completed: z.boolean(),
});
export type MarkCompleteDto = z.infer<typeof MarkCompleteSchema>;

// Natural language task creation
export const CreateTaskFromNLSchema = z.object({
  input: z.string().min(1).max(500),
  timezone: z.string().optional(), // e.g., "America/New_York"
});
export type CreateTaskFromNLDto = z.infer<typeof CreateTaskFromNLSchema>;

// Parsed task from NL input
export const ParsedTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date().nullable(),
  priority: z.number().min(1).max(4).optional(),
  tags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});
export type ParsedTask = z.infer<typeof ParsedTaskSchema>;

// Response from NL parsing
export const TaskParsingResponseSchema = z.object({
  original: z.string(),
  parsed: ParsedTaskSchema,
  task: TaskResponseSchema,
});
export type TaskParsingResponse = z.infer<typeof TaskParsingResponseSchema>;

// Preview response (without created task)
export const TaskParsingPreviewResponseSchema = z.object({
  original: z.string(),
  parsed: ParsedTaskSchema,
});
export type TaskParsingPreviewResponse = z.infer<typeof TaskParsingPreviewResponseSchema>;
