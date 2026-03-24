import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@pms/data-access';
import { SubscriptionStatusDto, TrialStatus } from '../dto/subscription-status.dto';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';
import { TenantBranding } from '../../domain/entities/subscription.entity';

const TRIAL_DAYS = 30;
const DEFAULT_BRANDING: Required<TenantBranding> = {
  primaryColor: '#3b82f6',
  appName: 'PMS',
  logoUrl: null,
};

@Injectable()
export class TrialService {
  constructor(private readonly prisma: PrismaClient) {}

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
}
