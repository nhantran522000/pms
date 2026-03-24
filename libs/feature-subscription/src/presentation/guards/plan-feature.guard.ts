import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';
import { PLAN_KEY } from '../decorators/require-plan.decorator';
import { Request } from 'express';

/**
 * Guard that restricts endpoint access based on tenant subscription tier.
 *
 * - Opt-in: Endpoints without @RequirePlan decorator are accessible to all authenticated users
 * - FREE tier: Accessible to all (baseline tier)
 * - PRO tier: Requires PRO subscription or active trial
 *
 * Throws ForbiddenException with upgradeUrl when tier requirement is not met.
 */
@Injectable()
export class PlanFeatureGuard implements CanActivate {
  private readonly upgradeUrl = 'https://lemonsqueezy.com/checkout/buy/...';

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required tier from decorator metadata
    const requiredTier = this.reflector.getAllAndOverride<SubscriptionTier>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No decorator = no restriction (opt-in pattern)
    if (!requiredTier) {
      return true;
    }

    // FREE tier is accessible to everyone
    if (requiredTier === SubscriptionTier.FREE) {
      return true;
    }

    // Get tenant from request (set by TenantContextMiddleware)
    const request = context.switchToHttp().getRequest<Request>();
    const tenant = request['tenant'];

    if (!tenant) {
      throw new ForbiddenException({
        message: 'Tenant information not found',
        upgradeUrl: this.upgradeUrl,
        currentTier: 'UNKNOWN',
        requiredTier,
      });
    }

    const currentTier = tenant.subscriptionTier || SubscriptionTier.FREE;

    // PRO tier check: allow if PRO or if trial is still active
    if (requiredTier === SubscriptionTier.PRO) {
      const isPro = currentTier === SubscriptionTier.PRO;
      const hasActiveTrial = tenant.trialEndDate && new Date(tenant.trialEndDate) > new Date();

      if (isPro || hasActiveTrial) {
        return true;
      }

      throw new ForbiddenException({
        message: 'This feature requires a PRO subscription',
        upgradeUrl: this.upgradeUrl,
        currentTier,
        requiredTier,
      });
    }

    return true;
  }
}
