import { Module } from '@nestjs/common';
import { PrismaModule } from '@pms/data-access';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { CategoryRepository } from './infrastructure/repositories/category.repository';
import { AccountService } from './application/services/account.service';
import { CategoryService } from './application/services/category.service';
import { AccountController } from './presentation/controllers/account.controller';
import { CategoryController } from './presentation/controllers/category.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController, CategoryController],
  providers: [AccountService, CategoryService, AccountRepository, CategoryRepository],
  exports: [AccountService, CategoryService],
})
export class FinancialModule {}
