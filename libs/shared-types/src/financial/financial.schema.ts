import { z } from 'zod';

// Account types
export const AccountTypeSchema = z.enum(['checking', 'savings', 'cash', 'credit']);
export type AccountType = z.infer<typeof AccountTypeSchema>;

// Create Account
export const CreateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  type: AccountTypeSchema,
  initialBalance: z.string().regex(/^-?\d+(\.\d{1,2})?$/).default('0'),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
export type CreateAccountDto = z.infer<typeof CreateAccountSchema>;

// Update Account
export const UpdateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
export type UpdateAccountDto = z.infer<typeof UpdateAccountSchema>;

// Account response
export const AccountResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  type: AccountTypeSchema,
  initialBalance: z.string(),
  currentBalance: z.string(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  isArchived: z.boolean(),
  balanceChange: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// Account summary with transaction count
export const AccountSummarySchema = AccountResponseSchema.extend({
  transactionCount: z.number(),
});
export type AccountSummary = z.infer<typeof AccountSummarySchema>;
