import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { LemonSqueezyService } from '../../infrastructure/services/lemonsqueezy.service';
import { SubscriptionTier } from '../../domain/enums/subscription-tier.enum';

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private lemonSqueezyService: LemonSqueezyService,
  ) {}

  /**
   * Process LemonSqueezy webhook event with idempotency
   * Uses Prisma transaction for atomic operations
   */
  async processEvent(payload: any, signature: string): Promise<{ success: boolean; message: string }> {
    // 1. Verify signature
    if (!this.lemonSqueezyService.verifySignature(JSON.stringify(payload), signature)) {
      return { success: false, message: 'Invalid signature' };
    }

    // 2. Extract event data
    const eventId = payload.meta?.event_id || payload.meta?.id;
    const eventType = payload.meta?.event_name;
    const tenantId = payload.meta?.custom_data?.tenant_id;
    const idempotencyKey = `${eventId}-${eventType}`;

    if (!tenantId) {
      return { success: false, message: 'Missing tenant_id in custom_data' };
    }

    // 3. Use Prisma transaction for atomic operations
    const result = await this.prisma.$transaction(async (tx) => {
      // Check for existing event within transaction
      const existing = await tx.webhookEvent.findUnique({
        where: { idempotencyKey },
      });

      if (existing) {
        if (existing.processed) {
          return { success: true, message: 'Duplicate event - already processed' };
        }
        // Race condition: event exists but not processed yet
        return { success: true, message: 'Event being processed' };
      }

      // Create event record within transaction
      await tx.webhookEvent.create({
        data: {
          tenantId,
          eventId,
          eventType,
          idempotencyKey,
          payload,
          processed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h TTL
        },
      });

      // Process event based on type
      await this.handleEventType(tx, eventType, tenantId, payload);

      // Mark as processed
      await tx.webhookEvent.update({
        where: { idempotencyKey },
        data: { processed: true },
      });

      return { success: true, message: 'Event processed successfully' };
    });

    return result;
  }

  /**
   * Handle specific event types
   */
  private async handleEventType(
    tx: any,
    eventType: string,
    tenantId: string,
    payload: any,
  ): Promise<void> {
    const tier = this.lemonSqueezyService.mapStatusToTier(
      payload.data?.attributes?.status,
    );

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
        await tx.tenant.update({
          where: { id: tenantId },
          data: { subscriptionTier: tier },
        });
        break;
      case 'subscription_cancelled':
      case 'subscription_expired':
        await tx.tenant.update({
          where: { id: tenantId },
          data: { subscriptionTier: SubscriptionTier.FREE },
        });
        break;
      default:
        // Unknown event type - just log it
        console.log(`Unknown event type: ${eventType}`);
    }
  }
}
