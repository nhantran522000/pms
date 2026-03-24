import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@pms/data-access';
import { SubscriptionStatusDto, TrialStatus } from '../dto/subscription-status.dto';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';
import { TenantBranding } from '../../domain/entities/subscription.entity';
import { TrialWarningService } from './trial-warning.service';

const TRIAL_DAYS = 30;
const DEFAULT_BRANDING: Required<TenantBranding> = {
  primaryColor: '#3b82f6',
  appName: 'PMS',
  logoUrl: null,
};

export interface TrialExpiryResult {
  expired: boolean;
  tierChanged: boolean;
  newTier: SubscriptionTier;
}

export interface TrialBannerState {
  daysRemaining: number;
  message: string;
}

export type BannerState = TrialBannerState | { expired: true; message: string };

@Injectable()
export class TrialService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly trialWarningService: TrialWarningService,
  ) {}

  async initializeTrial(tenantId: string): Promise<void> {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DAYS);
    trialEndDate.setUTCHours(23, 59, 59, 999); // End of trial day in UTC

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionTier: SubscriptionTier.FREE,
        trialEndDate,
      },
    });

    // Schedule warning email for Day 27 at 9 AM UTC
    await this.trialWarningService.scheduleTrialWarning(tenantId, trialEndDate);
  }

  async getTrialStatus(tenantId: string): Promise<TrialStatus> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { trialEndDate: true },
    });

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    if (!tenant.trialEndDate) {
      return {
        isActive: false,
        daysRemaining: 0,
        trialEndDate: null,
      };
    }

    const now = new Date();
    const trialEnd = new Date(tenant.trialEndDate);
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
      isActive: daysRemaining > 0,
      daysRemaining,
      trialEndDate: trialEnd,
    };
  }

  async isTrialExpired(tenantId: string): Promise<boolean> {
    const status = await this.getTrialStatus(tenantId);
    return !status.isActive && status.trialEndDate !== null;
  }

  async getSubscriptionStatus(tenantId: string): Promise<SubscriptionStatusDto> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        subscriptionTier: true,
        trialEndDate: true,
        branding: true,
        lemonsqueezyCustomerId: true,
        lemonsqueezySubscriptionId: true,
      },
    });

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const trialStatus = await this.getTrialStatus(tenantId);
    const branding = (tenant.branding as TenantBranding) || {};

    return {
      tier: tenant.subscriptionTier as SubscriptionTier,
      trialEndDate: tenant.trialEndDate,
      isTrialActive: trialStatus.isActive,
      daysRemaining: trialStatus.daysRemaining,
      branding: {
        primaryColor: branding.primaryColor || DEFAULT_BRANDING.primaryColor,
        appName: branding.appName || DEFAULT_BRANDING.appName,
        logoUrl: branding.logoUrl ?? DEFAULT_BRANDING.logoUrl,
      },
    };
  }

  /**
   * Check if trial is expired and handle tier downgrade
   * If expired and not already on FREE tier, update to FREE
   * @param tenantId The tenant ID
   * @returns Trial expiry result with tier change information
   */
  async checkAndHandleExpiry(tenantId: string): Promise<TrialExpiryResult> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        subscriptionTier: true,
        trialEndDate: true,
      },
    });

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    // Check if trial is expired
    const expired = await this.isTrialExpired(tenantId);

    if (!expired) {
      return {
        expired: false,
        tierChanged: false,
        newTier: tenant.subscriptionTier as SubscriptionTier,
      };
    }

    // Trial is expired - check if already on FREE tier
    const currentTier = tenant.subscriptionTier as SubscriptionTier;
    if (currentTier === SubscriptionTier.FREE) {
      return {
        expired: true,
        tierChanged: false,
        newTier: SubscriptionTier.FREE,
      };
    }

    // Downgrade to FREE tier
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionTier: SubscriptionTier.FREE,
      },
    });

    return {
      expired: true,
      tierChanged: true,
      newTier: SubscriptionTier.FREE,
    };
  }

  /**
   * Get trial banner state for frontend display
   * Returns null if not in warning period
   * Returns days remaining if within 3 days of expiry
   * Returns expired state if trial has ended
   * @param tenantId The tenant ID
   * @returns Banner state or null
   */
  async getTrialBannerState(tenantId: string): Promise<BannerState | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        trialEndDate: true,
        subscriptionTier: true,
      },
    });

    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    // Only show banner if tenant has a trial end date
    if (!tenant.trialEndDate) {
      return null;
    }

    const trialStatus = await this.getTrialStatus(tenantId);

    // If trial is expired, show expired banner
    if (trialStatus.daysRemaining === 0) {
      return {
        expired: true,
        message: 'Your trial has expired. Some features are now restricted.',
      };
    }

    // Show warning banner if within 3 days of expiry (Day 27, 28, 29)
    const WARNING_DAYS = 3;
    if (trialStatus.daysRemaining <= WARNING_DAYS) {
      return {
        daysRemaining: trialStatus.daysRemaining,
        message: `Your trial expires in ${trialStatus.daysRemaining} day${trialStatus.daysRemaining === 1 ? '' : 's'}. Upgrade to PRO to continue enjoying all features.`,
      };
    }

    // Not in warning period
    return null;
  }
}
