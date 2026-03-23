import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HealthLogController } from './presentation/controllers/health-log.controller';
import { HealthTrendsController } from './presentation/controllers/health-trends.controller';
import { HealthLogService } from './application/services/health-log.service';
import { HealthTrendsService } from './application/services/health-trends.service';
import { HealthLogRepository } from './infrastructure/repositories/health-log.repository';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HealthLogController, HealthTrendsController],
  providers: [HealthLogService, HealthTrendsService, HealthLogRepository],
  exports: [HealthLogService, HealthTrendsService],
})
export class HealthModule {}
