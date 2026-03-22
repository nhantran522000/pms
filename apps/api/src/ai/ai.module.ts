import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { PrismaModule } from '@pms/data-access';
import { UsageLoggingService } from '@pms/shared-kernel';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [UsageLoggingService],
})
export class AiModule {}
