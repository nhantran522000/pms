import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrialService } from './application/services/trial.service';
import { TrialWarningService } from './application/services/trial-warning.service';
import { WebhookService } from './application/services/webhook.service';
import { LemonSqueezyService } from './infrastructure/services/lemonsqueezy.service';
import { TrialWarningJob } from './infrastructure/jobs/trial-warning.job';
import { TrialController } from './presentation/controllers/trial.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';
import { PrismaModule } from '@pms/data-access';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    TrialService,
    TrialWarningService,
    TrialWarningJob,
    WebhookService,
    LemonSqueezyService,
  ],
  exports: [
    TrialService,
    TrialWarningService,
    WebhookService,
    LemonSqueezyService,
  ],
  controllers: [TrialController, WebhookController],
})
export class SubscriptionModule {}
