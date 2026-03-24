import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { lemonSqueezySetup, getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';

@Injectable()
export class LemonSqueezyService {
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('LEMONSQUEEZY_API_KEY');
    this.webhookSecret = this.configService.get<string>('LEMONSQUEEZY_WEBHOOK_SECRET') || '';

    if (apiKey) {
      lemonSqueezySetup({ apiKey });
    }
  }

  /**
   * Verify LemonSqueezy webhook signature using HMAC-SHA256
   * Uses timingSafeEqual to prevent timing attacks
   */
  verifySignature(payload: string, signature: string): boolean {
    if (!this.webhookSecret) {
      throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
    }

    const hmac = createHmac('sha256', this.webhookSecret);
    hmac.update(payload);
    const digest = hmac.digest('base64');

    // Use timing-safe comparison to prevent timing attacks
    try {
      return timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest),
      );
    } catch {
      return false;
    }
  }

  /**
   * Fetch subscription details from LemonSqueezy
   */
  async getSubscription(subscriptionId: string) {
    try {
      const response = await getSubscription(subscriptionId);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  /**
   * Map LemonSqueezy subscription status to internal subscription tier
   */
  mapStatusToTier(status: string): SubscriptionTier {
    if (status === 'active') {
      return SubscriptionTier.PRO;
    }
    if (status === 'on_trial') {
      return SubscriptionTier.FREE;
    }
    // All other statuses (cancelled, expired, paused, past_due, unpaid) -> FREE
    return SubscriptionTier.FREE;
  }
}
