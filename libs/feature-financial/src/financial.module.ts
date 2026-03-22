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
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { BudgetEnvelopeRepository } from './infrastructure/repositories/budget-envelope.repository';
import { RecurringRuleRepository } from './infrastructure/repositories/recurring-rule.repository';
import { AccountService } from './application/services/account.service';
import { CategoryService } from './application/services/category.service';
import { TransactionService } from './application/services/transaction.service';
import { AiCategorizationService } from './application/services/ai-categorization.service';
import { BudgetService } from './application/services/budget.service';
import { RecurringTransactionService } from './application/services/recurring-transaction.service';
import { AccountController } from './presentation/controllers/account.controller';
import { CategoryController } from './presentation/controllers/category.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { BudgetController } from './presentation/controllers/budget.controller';
import { RecurringRuleController } from './presentation/controllers/recurring-rule.controller';
import { RecurringTransactionJob } from './infrastructure/jobs/recurring-transaction.job';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    AccountController,
    CategoryController,
    TransactionController,
    BudgetController,
    RecurringRuleController,
  ],
  providers: [
    // AI providers for categorization
    GroqProvider,
    GeminiProvider,
    CircuitBreakerService,
    PromptCacheService,
    TokenBudgetService,
    UsageLoggingService,
    AiGatewayService,
    // Financial services
    AccountService,
    CategoryService,
    TransactionService,
    AiCategorizationService,
    BudgetService,
    RecurringTransactionService,
    // Repositories
    AccountRepository,
    CategoryRepository,
    TransactionRepository,
    BudgetEnvelopeRepository,
    RecurringRuleRepository,
    // Jobs
    RecurringTransactionJob,
  ],
  exports: [
    AccountService,
    CategoryService,
    TransactionService,
    AiCategorizationService,
    BudgetService,
    RecurringTransactionService,
  ],
})
export class FinancialModule {}
