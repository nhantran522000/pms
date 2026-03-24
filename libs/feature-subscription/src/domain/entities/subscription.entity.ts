import { SubscriptionTier } from '../enums/subscription-tier.enum';

export interface TenantBranding {
  primaryColor?: string;  // Hex color, default "#3b82f6"
  appName?: string;       // Default "PMS"
  logoUrl?: string | null; // URL to logo image
}

export class SubscriptionStatus {
  constructor(
    public id: string, // tenantId
    public tier: SubscriptionTier,
    public trialEndDate: Date | null,
    public branding: TenantBranding | null,
    public lemonsqueezyCustomerId: string | null,
    public lemonsqueezySubscriptionId: string | null,
  ) {}
}
