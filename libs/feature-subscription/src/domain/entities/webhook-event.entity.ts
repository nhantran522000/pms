export interface WebhookEventEntity {
  id: string;
  tenantId: string;
  eventId: string;
  eventType: string;
  idempotencyKey: string;
  payload: any;
  processed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface CreateWebhookEventDto {
  tenantId: string;
  eventId: string;
  eventType: string;
  idempotencyKey: string;
  payload: any;
  expiresAt: Date;
}
