import { SetMetadata } from '@nestjs/common';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';

export const PLAN_KEY = 'plan';

/**
 * Decorator to mark endpoints as requiring a specific subscription tier.
 *
 * Usage:
 * @RequirePlan(SubscriptionTier.PRO)
 * @Get('premium-feature')
 * getPremiumFeature() { ... }
 *
 * @param tier - The subscription tier required to access this endpoint
 */
export const RequirePlan = (tier: SubscriptionTier) => SetMetadata(PLAN_KEY, tier);
