import { Controller, Post, Body, Headers } from '@nestjs/common';
import { WebhookService } from '../../application/services/webhook.service';
import { Public } from '@pms/feature-auth';

@Controller('subscription')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * LemonSqueezy webhook endpoint
   * Public endpoint - no authentication required
   * Returns 200 immediately to prevent webhook retries
   */
  @Post('webhook')
  @Public()
  async handleWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.webhookService.processEvent(JSON.stringify(body), signature);
  }
}
