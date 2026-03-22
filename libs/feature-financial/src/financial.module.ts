import { Module } from '@nestjs/common';
import { PrismaModule } from '@pms/data-access';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { AccountService } from './application/services/account.service';
import { CategoryService } from './application/services/category.service';
import { TransactionService } from './application/services/transaction.service';
import { AccountController } from './presentation/controllers/account.controller';
import { CategoryController } from './presentation/controllers/category.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController, CategoryController, TransactionController],
  providers: [
    AccountService,
    CategoryService,
    TransactionService,
    AccountRepository,
    CategoryRepository,
    TransactionRepository,
  ],
  exports: [AccountService, CategoryService, TransactionService],
})
export class FinancialModule {}
