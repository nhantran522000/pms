import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { TransactionRepository, CreateTransactionInput } from '../../infrastructure/repositories/transaction.repository';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { CreateTransactionDto, UpdateTransactionDto, TransactionWithRelations } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(dto: CreateTransactionDto): Promise<TransactionEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    this.logger.log(`Creating transaction for account: ${dto.accountId}`);

    // Verify account exists
    const account = await this.accountRepository.findById(dto.accountId, tenantId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    // Verify category exists if provided
    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId, tenantId);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    const amount = Money.fromDecimal(dto.amount);
    const date = typeof dto.date === 'string' ? new Date(dto.date) : dto.date;

    const input: CreateTransactionInput = {
      tenantId,
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount,
      type: dto.type,
      payee: dto.payee ?? null,
      description: dto.description ?? null,
      date,
    };

    const transaction = await this.transactionRepository.create(input);

    // Update account balance: income adds, expense subtracts
    const balanceAdjustment = dto.type === 'income' ? amount : amount.multiply(-1);
    await this.accountRepository.updateBalance(dto.accountId, tenantId, balanceAdjustment);

    this.logger.log(`Transaction created: ${transaction.id}, balance adjusted by ${balanceAdjustment.toString()}`);

    return transaction;
  }

  async findById(id: string): Promise<TransactionEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const transaction = await this.transactionRepository.findById(id, tenantId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findAll(options?: {
    accountId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
    limit?: number;
    offset?: number;
  }): Promise<TransactionEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.transactionRepository.findAll(tenantId, options);
  }

  async findWithRelations(options?: {
    accountId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
    limit?: number;
    offset?: number;
  }): Promise<TransactionWithRelations[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const transactions = await this.transactionRepository.findWithRelations(tenantId, options);

    return transactions.map((t) => ({
      ...t.toJSON(),
      account: t.account,
      category: t.category,
    }));
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<TransactionEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Get original transaction
    const original = await this.transactionRepository.findById(id, tenantId);
    if (!original) {
      throw new NotFoundException('Transaction not found');
    }

    // Verify new account exists if changing
    if (dto.accountId && dto.accountId !== original.accountId) {
      const account = await this.accountRepository.findById(dto.accountId, tenantId);
      if (!account) {
        throw new BadRequestException('Account not found');
      }
    }

    // Verify new category exists if changing
    if (dto.categoryId !== undefined && dto.categoryId !== null) {
      const category = await this.categoryRepository.findById(dto.categoryId, tenantId);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    // Calculate balance adjustments
    const changes: { oldAccount?: string; newAccount?: string; oldAmount?: Money; newAmount?: Money } = {};

    if (dto.accountId && dto.accountId !== original.accountId) {
      changes.oldAccount = original.accountId;
      changes.newAccount = dto.accountId;
    }

    if (dto.amount || dto.type) {
      const oldAmount = original.getSignedAmount();
      const newAmountValue = dto.amount ? Money.fromDecimal(dto.amount) : original.amount;
      const newType = dto.type ?? original.type;
      const newAmount = newType === 'income' ? newAmountValue : newAmountValue.multiply(-1);

      if (!oldAmount.equals(newAmount)) {
        changes.oldAmount = oldAmount;
        changes.newAmount = newAmount;
      }
    }

    // Update transaction
    const input: Partial<CreateTransactionInput> = {
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount: dto.amount ? Money.fromDecimal(dto.amount) : undefined,
      type: dto.type,
      payee: dto.payee ?? null,
      description: dto.description ?? null,
      date: dto.date ? (typeof dto.date === 'string' ? new Date(dto.date) : dto.date) : undefined,
    };

    const transaction = await this.transactionRepository.update(id, tenantId, input);

    // Apply balance adjustments
    if (changes.oldAccount && changes.newAccount) {
      // Account changed: reverse on old, apply to new
      const signedOriginal = original.getSignedAmount();
      await this.accountRepository.updateBalance(changes.oldAccount, tenantId, signedOriginal.multiply(-1));
      await this.accountRepository.updateBalance(changes.newAccount, tenantId, signedOriginal);
    } else if (changes.oldAmount && changes.newAmount) {
      // Amount or type changed: apply difference
      const diff = changes.newAmount.subtract(changes.oldAmount);
      const accountId = changes.newAccount ?? original.accountId;
      await this.accountRepository.updateBalance(accountId, tenantId, diff);
    }

    this.logger.log(`Transaction updated: ${id}`);
    return transaction;
  }

  async softDelete(id: string): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const transaction = await this.transactionRepository.findById(id, tenantId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository.softDelete(id, tenantId);

    // Reverse balance adjustment
    const signedAmount = transaction.getSignedAmount().multiply(-1);
    await this.accountRepository.updateBalance(transaction.accountId, tenantId, signedAmount);

    this.logger.log(`Transaction soft deleted: ${id}`);
  }

  async restore(id: string): Promise<TransactionEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const transaction = await this.transactionRepository.findByIdIncludingDeleted(id, tenantId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (!transaction.isDeleted) {
      throw new BadRequestException('Transaction is not deleted');
    }

    const restored = await this.transactionRepository.restore(id, tenantId);

    // Re-apply balance adjustment
    const signedAmount = transaction.getSignedAmount();
    await this.accountRepository.updateBalance(transaction.accountId, tenantId, signedAmount);

    this.logger.log(`Transaction restored: ${id}`);
    return restored;
  }

  async getTotals(options?: { startDate?: Date; endDate?: Date; accountId?: string }): Promise<{
    income: string;
    expense: string;
    net: string;
  }> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const totals = await this.transactionRepository.getTotals(tenantId, options);

    return {
      income: totals.income.toString(),
      expense: totals.expense.toString(),
      net: totals.income.subtract(totals.expense).toString(),
    };
  }

  async count(options?: {
    accountId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
  }): Promise<number> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.transactionRepository.count(tenantId, options);
  }
}
