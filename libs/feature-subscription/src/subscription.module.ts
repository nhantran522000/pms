import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrialService } from './application/services/trial.service';
import { WebhookService } from './application/services/webhook.service';
import { LemonSqueezyService } from './infrastructure/services/lemonsqueezy.service';
import { TrialController } from './presentation/controllers/trial.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';
import { PrismaModule } from '@pms/data-access';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [TrialService, WebhookService, LemonSqueezyService],
  exports: [TrialService, WebhookService, LemonSqueezyService],
  controllers: [TrialController, WebhookController],
})
export class SubscriptionModule {}
