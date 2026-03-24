import { z } from 'zod';

export const CreateWebhookEventDto = z.object({
  meta: z.object({
    event_id: z.string(),
    event_name: z.string(),
    custom_data: z.object({
      tenant_id: z.string(),
    }).optional(),
  }),
  data: z.any(),
});

export type CreateWebhookEventType = z.infer<typeof CreateWebhookEventDto>;
