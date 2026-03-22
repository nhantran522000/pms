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
