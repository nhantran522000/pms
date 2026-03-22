import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { PrismaModule } from '@pms/data-access';
import {
  AiGatewayService,
  UsageLoggingService,
  PromptCacheService,
  TokenBudgetService,
  CircuitBreakerService,
} from '@pms/shared-kernel';
import { GroqProvider } from '@pms/shared-kernel';
import { GeminiProvider } from '@pms/shared-kernel';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AiController],
  providers: [
    GroqProvider,
    GeminiProvider,
    CircuitBreakerService,
    PromptCacheService,
    TokenBudgetService,
    UsageLoggingService,
    AiGatewayService,
  ],
})
export class AiModule {}
