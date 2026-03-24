import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HobbyController } from './presentation/controllers/hobby.controller';
import { HobbyLogController } from './presentation/controllers/hobby-log.controller';
import { HobbyTrendsController } from './presentation/controllers/hobby-trends.controller';
import { HobbyService } from './application/services/hobby.service';
import { HobbyLogService } from './application/services/hobby-log.service';
import { HobbyTrendsService } from './application/services/hobby-trends.service';
import { HobbyRepository } from './infrastructure/repositories/hobby.repository';
import { HobbyLogRepository } from './infrastructure/repositories/hobby-log.repository';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HobbyController, HobbyLogController, HobbyTrendsController],
  providers: [
    HobbyService,
    HobbyLogService,
    HobbyTrendsService,
    HobbyRepository,
    HobbyLogRepository,
  ],
  exports: [
    HobbyService,
    HobbyLogService,
    HobbyTrendsService,
  ],
})
export class HobbiesModule {}
