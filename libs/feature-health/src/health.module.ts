import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import {
  AiGatewayService,
  UsageLoggingService,
  PromptCacheService,
  TokenBudgetService,
  CircuitBreakerService,
  GroqProvider,
  GeminiProvider,
} from '@pms/shared-kernel';
import { HealthLogController } from './presentation/controllers/health-log.controller';
import { HealthTrendsController } from './presentation/controllers/health-trends.controller';
import { VitalsController } from './presentation/controllers/vitals.controller';
import { SleepController } from './presentation/controllers/sleep.controller';
import { WorkoutController } from './presentation/controllers/workout.controller';
import { HealthLogService } from './application/services/health-log.service';
import { HealthTrendsService } from './application/services/health-trends.service';
import { VitalsService } from './application/services/vitals.service';
import { SleepService } from './application/services/sleep.service';
import { WorkoutService } from './application/services/workout.service';
import { HealthDigestService } from './application/services/health-digest.service';
import { HealthLogRepository } from './infrastructure/repositories/health-log.repository';
import { HealthDigestJob } from './infrastructure/jobs/health-digest.job';
import { EmailService } from './infrastructure/email/email.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    HealthLogController,
    HealthTrendsController,
    VitalsController,
    SleepController,
    WorkoutController,
  ],
  providers: [
    // AI providers for health digest
    GroqProvider,
    GeminiProvider,
    CircuitBreakerService,
    PromptCacheService,
    TokenBudgetService,
    UsageLoggingService,
    AiGatewayService,
    // Health services
    HealthLogService,
    HealthTrendsService,
    VitalsService,
    SleepService,
    WorkoutService,
    HealthDigestService,
    // Infrastructure
    HealthLogRepository,
    EmailService,
    HealthDigestJob,
  ],
  exports: [
    HealthLogService,
    HealthTrendsService,
    VitalsService,
    SleepService,
    WorkoutService,
    HealthDigestService,
    EmailService,
  ],
})
export class HealthModule {}
