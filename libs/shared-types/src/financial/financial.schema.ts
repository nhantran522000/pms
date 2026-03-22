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

// ============================================
// Category types
// ============================================
export const CategoryTypeSchema = z.enum(['income', 'expense']);
export type CategoryType = z.infer<typeof CategoryTypeSchema>;

// Create Category
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.string().cuid().optional().nullable(),
  type: CategoryTypeSchema,
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

// Update Category
export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  parentId: z.string().cuid().nullable().optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

// Category response
export const CategoryResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  type: CategoryTypeSchema,
  isSystem: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;

// Category with children (for hierarchy)
export interface CategoryTree extends z.infer<typeof CategoryResponseSchema> {
  children?: CategoryTree[];
}

export const CategoryTreeSchema: z.ZodType<CategoryTree> = z.lazy(() =>
  CategoryResponseSchema.extend({
    children: z.array(CategoryTreeSchema).optional(),
  })
);

// ============================================
// Transaction types
// ============================================
export const TransactionTypeSchema = z.enum(['income', 'expense']);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

// Create Transaction
export const CreateTransactionSchema = z.object({
  accountId: z.string().cuid(),
  categoryId: z.string().cuid().optional().nullable(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  type: TransactionTypeSchema,
  payee: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().or(z.date()),
});
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;

// Update Transaction
export const UpdateTransactionSchema = z.object({
  accountId: z.string().cuid().optional(),
  categoryId: z.string().cuid().nullable().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  type: TransactionTypeSchema.optional(),
  payee: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  date: z.string().datetime().or(z.date()).optional(),
});
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;

// Transaction response
export const TransactionResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  accountId: z.string(),
  categoryId: z.string().nullable(),
  amount: z.string(),
  type: TransactionTypeSchema,
  payee: z.string().nullable(),
  description: z.string().nullable(),
  date: z.date(),
  isRecurring: z.boolean(),
  recurringRuleId: z.string().nullable(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;

// Transaction with related entities
export const TransactionWithRelationsSchema = TransactionResponseSchema.extend({
  account: z.object({
    id: z.string(),
    name: z.string(),
    type: AccountTypeSchema,
  }).optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    type: CategoryTypeSchema,
  }).nullable().optional(),
});
export type TransactionWithRelations = z.infer<typeof TransactionWithRelationsSchema>;

// ============================================
// Budget envelope types
// ============================================

// Allocate budget to a category for a specific month
export const AllocateBudgetSchema = z.object({
  categoryId: z.string().cuid(),
  accountId: z.string().cuid(),
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
  allocated: z.string().regex(/^\d+(\.\d{1,2})?$/),
});
export type AllocateBudgetDto = z.infer<typeof AllocateBudgetSchema>;

// Update allocation amount
export const UpdateAllocationSchema = z.object({
  allocated: z.string().regex(/^\d+(\.\d{1,2})?$/),
});
export type UpdateAllocationDto = z.infer<typeof UpdateAllocationSchema>;

// Budget envelope response
export const BudgetEnvelopeResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  categoryId: z.string(),
  accountId: z.string(),
  month: z.string(), // YYYY-MM format
  allocated: z.string(),
  spent: z.string(),
  rolledOver: z.string(),
  available: z.string(),
  remaining: z.string(),
  isOverBudget: z.boolean(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type BudgetEnvelopeResponse = z.infer<typeof BudgetEnvelopeResponseSchema>;

// Budget summary for a month
export const BudgetSummarySchema = z.object({
  month: z.string(),
  totalAllocated: z.string(),
  totalSpent: z.string(),
  totalRolledOver: z.string(),
  totalAvailable: z.string(),
  envelopes: z.array(BudgetEnvelopeResponseSchema),
});
export type BudgetSummary = z.infer<typeof BudgetSummarySchema>;

// ============================================
// AI Categorization types
// ============================================

// AI Categorization request
export const CategorizeTransactionSchema = z.object({
  payee: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  type: TransactionTypeSchema.optional(), // Hint for income/expense categories
});
export type CategorizeTransactionDto = z.infer<typeof CategorizeTransactionSchema>;

// AI Categorization result
export const CategorySuggestionSchema = z.object({
  categoryId: z.string().nullable(),
  categoryName: z.string(),
  confidence: z.number().min(0).max(1),
  alternatives: z.array(z.object({
    categoryId: z.string().nullable(),
    categoryName: z.string(),
    confidence: z.number(),
  })).optional(),
});
export type CategorySuggestion = z.infer<typeof CategorySuggestionSchema>;

// ============================================
// Recurring Rule types
// ============================================

// Recurring frequency types
export const RecurringFrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);
export type RecurringFrequency = z.infer<typeof RecurringFrequencySchema>;

// Create Recurring Rule
export const CreateRecurringRuleSchema = z.object({
  accountId: z.string().cuid(),
  categoryId: z.string().cuid().optional().nullable(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  type: TransactionTypeSchema,
  payee: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  frequency: RecurringFrequencySchema,
  interval: z.number().int().min(1).default(1),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(), // 0 = Sunday
  monthOfYear: z.number().int().min(1).max(12).optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()).optional().nullable(),
});
export type CreateRecurringRuleDto = z.infer<typeof CreateRecurringRuleSchema>;

// Update Recurring Rule
export const UpdateRecurringRuleSchema = z.object({
  categoryId: z.string().cuid().nullable().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  payee: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateRecurringRuleDto = z.infer<typeof UpdateRecurringRuleSchema>;

// Recurring Rule response
export const RecurringRuleResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  accountId: z.string(),
  categoryId: z.string().nullable(),
  amount: z.string(),
  type: TransactionTypeSchema,
  payee: z.string().nullable(),
  description: z.string().nullable(),
  frequency: RecurringFrequencySchema,
  interval: z.number(),
  dayOfMonth: z.number().nullable(),
  dayOfWeek: z.number().nullable(),
  monthOfYear: z.number().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  nextRunAt: z.date().nullable(),
  lastRunAt: z.date().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RecurringRuleResponse = z.infer<typeof RecurringRuleResponseSchema>;
