import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrialService } from './application/services/trial.service';
import { TrialWarningService } from './application/services/trial-warning.service';
import { WebhookService } from './application/services/webhook.service';
import { BrandingService } from './application/services/branding.service';
import { LemonSqueezyService } from './infrastructure/services/lemonsqueezy.service';
import { TrialWarningJob } from './infrastructure/jobs/trial-warning.job';
import { TrialController } from './presentation/controllers/trial.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';
import { BrandingController } from './presentation/controllers/branding.controller';
import { PlanFeatureGuard } from './presentation/guards/plan-feature.guard';
import { PrismaModule } from '@pms/data-access';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    TrialService,
    TrialWarningService,
    TrialWarningJob,
    WebhookService,
    LemonSqueezyService,
    BrandingService,
    PlanFeatureGuard,
  ],
  exports: [
    TrialService,
    TrialWarningService,
    WebhookService,
    LemonSqueezyService,
    BrandingService,
    PlanFeatureGuard,
  ],
  controllers: [TrialController, WebhookController, BrandingController],
})
export class SubscriptionModule {}
