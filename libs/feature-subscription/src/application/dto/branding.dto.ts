import { z } from 'zod';

// Validation schema for updating branding
export const UpdateBrandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  appName: z.string().min(1).max(50).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

export type UpdateBrandingDto = z.infer<typeof UpdateBrandingSchema>;

// Response schema with defaults applied
export const BrandingResponseSchema = z.object({
  primaryColor: z.string(),
  appName: z.string(),
  logoUrl: z.string().nullable(),
});

export type BrandingResponseDto = z.infer<typeof BrandingResponseSchema>;

// System defaults per CONTEXT.md
export const BRANDING_DEFAULTS = {
  primaryColor: '#3b82f6',
  appName: 'PMS',
  logoUrl: null,
} as const;
