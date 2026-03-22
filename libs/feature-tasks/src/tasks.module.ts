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
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { TaskService } from './application/services/task.service';
import { TaskParsingService } from './application/services/task-parsing.service';
import { TaskController } from './presentation/controllers/task.controller';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [TaskController],
  providers: [
    // AI providers for natural language parsing
    GroqProvider,
    GeminiProvider,
    CircuitBreakerService,
    PromptCacheService,
    TokenBudgetService,
    UsageLoggingService,
    AiGatewayService,
    // Task services
    TaskService,
    TaskParsingService,
    // Repositories
    TaskRepository,
  ],
  exports: [TaskService, TaskParsingService],
})
export class TasksModule {}
