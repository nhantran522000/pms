import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';
import { TenantBranding } from '../../domain/entities/subscription.entity';

export class SubscriptionStatusDto {
  tier: SubscriptionTier;
  trialEndDate: Date | null;
  isTrialActive: boolean;
  daysRemaining: number;
  branding: Required<TenantBranding>; // With defaults applied
}

export interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
}
