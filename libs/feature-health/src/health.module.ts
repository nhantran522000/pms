import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HealthLogController } from './presentation/controllers/health-log.controller';
import { HealthTrendsController } from './presentation/controllers/health-trends.controller';
import { VitalsController } from './presentation/controllers/vitals.controller';
import { HealthLogService } from './application/services/health-log.service';
import { HealthTrendsService } from './application/services/health-trends.service';
import { VitalsService } from './application/services/vitals.service';
import { HealthLogRepository } from './infrastructure/repositories/health-log.repository';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HealthLogController, HealthTrendsController, VitalsController],
  providers: [HealthLogService, HealthTrendsService, VitalsService, HealthLogRepository],
  exports: [HealthLogService, HealthTrendsService, VitalsService],
})
export class HealthModule {}
