import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { AccountEntity, AccountType } from '../../domain/entities/account.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { CreateAccountDto, UpdateAccountDto } from '@pms/shared-types';

export interface CreateAccountInput extends Omit<CreateAccountDto, 'initialBalance'> {
  tenantId: string;
  initialBalance: Money;
}

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAccountInput): Promise<AccountEntity> {
    const account = await this.prisma.account.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        type: input.type,
        initialBalance: input.initialBalance.toPrisma(),
        currentBalance: input.initialBalance.toPrisma(),
        icon: input.icon,
        color: input.color,
        isArchived: false,
      },
    });

    return AccountEntity.fromPrisma(account);
  }

  async findById(id: string, tenantId: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findFirst({
      where: { id, tenantId },
    });
    return account ? AccountEntity.fromPrisma(account) : null;
  }

  async findByName(name: string, tenantId: string): Promise<AccountEntity | null> {
    const account = await this.prisma.account.findFirst({
      where: { name, tenantId },
    });
    return account ? AccountEntity.fromPrisma(account) : null;
  }

  async findAll(tenantId: string, includeArchived = false): Promise<AccountEntity[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        tenantId,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      orderBy: { name: 'asc' },
    });
    return accounts.map((a) => AccountEntity.fromPrisma(a));
  }

  async findByType(tenantId: string, type: AccountType): Promise<AccountEntity[]> {
    const accounts = await this.prisma.account.findMany({
      where: { tenantId, type, isArchived: false },
      orderBy: { name: 'asc' },
    });
    return accounts.map((a) => AccountEntity.fromPrisma(a));
  }

  async update(id: string, tenantId: string, input: UpdateAccountDto): Promise<AccountEntity> {
    const account = await this.prisma.account.update({
      where: { id },
      data: {
        name: input.name,
        icon: input.icon,
        color: input.color,
      },
    });

    return AccountEntity.fromPrisma(account);
  }

  async archive(id: string, tenantId: string): Promise<AccountEntity> {
    const account = await this.prisma.account.update({
      where: { id },
      data: { isArchived: true },
    });

    return AccountEntity.fromPrisma(account);
  }

  async unarchive(id: string, tenantId: string): Promise<AccountEntity> {
    const account = await this.prisma.account.update({
      where: { id },
      data: { isArchived: false },
    });

    return AccountEntity.fromPrisma(account);
  }

  /**
   * Update account balance by applying a transaction amount
   * Used when creating/modifying/deleting transactions
   */
  async updateBalance(
    accountId: string,
    tenantId: string,
    amount: Money,
  ): Promise<AccountEntity> {
    const account = await this.prisma.account.update({
      where: { id: accountId },
      data: {
        currentBalance: {
          increment: amount.toPrisma(),
        },
      },
    });

    return AccountEntity.fromPrisma(account);
  }

  /**
   * Recalculate account balance from all transactions
   * Used for data integrity checks or after bulk operations
   */
  async recalculateBalance(accountId: string, tenantId: string): Promise<AccountEntity> {
    // Get account's initial balance
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, tenantId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Sum all transactions
    const result = await this.prisma.transaction.aggregate({
      where: {
        accountId,
        isDeleted: false,
      },
      _sum: {
        amount: true,
      },
    });

    const initialBalance = Money.fromPrisma(account.initialBalance);
    const transactionSum = result._sum.amount
      ? Money.fromPrisma(result._sum.amount)
      : Money.zero();

    // Calculate: income adds, expense subtracts
    // The sum already accounts for type via signed amounts
    const newBalance = initialBalance.add(transactionSum);

    // Update balance
    const updated = await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: newBalance.toPrisma() },
    });

    return AccountEntity.fromPrisma(updated);
  }

  async countTransactions(id: string, tenantId: string): Promise<number> {
    return this.prisma.transaction.count({
      where: { accountId: id, isDeleted: false },
    });
  }

  async getTotalBalance(tenantId: string): Promise<Money> {
    const result = await this.prisma.account.aggregate({
      where: { tenantId, isArchived: false },
      _sum: { currentBalance: true },
    });

    return result._sum.currentBalance
      ? Money.fromPrisma(result._sum.currentBalance)
      : Money.zero();
  }
}
