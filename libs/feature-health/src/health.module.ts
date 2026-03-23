import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
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
    HealthLogService,
    HealthTrendsService,
    VitalsService,
    SleepService,
    WorkoutService,
    HealthDigestService,
    HealthLogRepository,
    HealthDigestJob,
  ],
  exports: [
    HealthLogService,
    HealthTrendsService,
    VitalsService,
    SleepService,
    WorkoutService,
    HealthDigestService,
  ],
})
export class HealthModule {}
