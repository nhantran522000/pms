import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { Prisma } from '@prisma/client';

export interface CreateTransactionInput {
  tenantId: string;
  accountId: string;
  categoryId: string | null;
  amount: Money;
  type: 'income' | 'expense';
  payee: string | null;
  description: string | null;
  date: Date;
  isRecurring?: boolean;
  recurringRuleId?: string | null;
}

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTransactionInput): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.create({
      data: {
        tenantId: input.tenantId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        amount: input.amount.toPrisma(),
        type: input.type,
        payee: input.payee,
        description: input.description,
        date: input.date,
        isRecurring: input.isRecurring ?? false,
        recurringRuleId: input.recurringRuleId ?? null,
        isDeleted: false,
      },
    });

    return TransactionEntity.fromPrisma(transaction);
  }

  async findById(id: string, tenantId: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, tenantId, isDeleted: false },
    });
    return transaction ? TransactionEntity.fromPrisma(transaction) : null;
  }

  async findByIdIncludingDeleted(id: string, tenantId: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, tenantId },
    });
    return transaction ? TransactionEntity.fromPrisma(transaction) : null;
  }

  async findAll(tenantId: string, options?: {
    accountId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
    limit?: number;
    offset?: number;
  }): Promise<TransactionEntity[]> {
    const where: Prisma.TransactionWhereInput = {
      tenantId,
      isDeleted: false,
      ...(options?.accountId && { accountId: options.accountId }),
      ...(options?.categoryId && { categoryId: options.categoryId }),
      ...(options?.type && { type: options.type }),
      ...(options?.startDate && { date: { gte: options.startDate } }),
      ...(options?.endDate && { date: { lte: options.endDate } }),
      ...(options?.startDate && options?.endDate && {
        date: { gte: options.startDate, lte: options.endDate },
      }),
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });

    return transactions.map((t) => TransactionEntity.fromPrisma(t));
  }

  async count(tenantId: string, options?: {
    accountId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
  }): Promise<number> {
    const where: Prisma.TransactionWhereInput = {
      tenantId,
      isDeleted: false,
      ...(options?.accountId && { accountId: options.accountId }),
      ...(options?.categoryId && { categoryId: options.categoryId }),
      ...(options?.type && { type: options.type }),
      ...(options?.startDate && { date: { gte: options.startDate } }),
      ...(options?.endDate && { date: { lte: options.endDate } }),
    };

    return this.prisma.transaction.count({ where });
  }

  async update(id: string, tenantId: string, input: Partial<CreateTransactionInput>): Promise<TransactionEntity> {
    const data: Prisma.TransactionUpdateInput = {};

    if (input.accountId !== undefined) data.account = { connect: { id: input.accountId } };
    if (input.categoryId !== undefined) {
      data.category = input.categoryId ? { connect: { id: input.categoryId } } : { disconnect: true };
    }
    if (input.amount !== undefined) data.amount = input.amount.toPrisma();
    if (input.type !== undefined) data.type = input.type;
    if (input.payee !== undefined) data.payee = input.payee;
    if (input.description !== undefined) data.description = input.description;
    if (input.date !== undefined) data.date = input.date;

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data,
    });

    return TransactionEntity.fromPrisma(transaction);
  }

  async softDelete(id: string, tenantId: string): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });

    return TransactionEntity.fromPrisma(transaction);
  }

  async restore(id: string, tenantId: string): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: false },
    });

    return TransactionEntity.fromPrisma(transaction);
  }

  async permanentDelete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  /**
   * Get transactions with related account and category data
   */
  async findWithRelations(
    tenantId: string,
    options?: {
      accountId?: string;
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
      type?: 'income' | 'expense';
      limit?: number;
      offset?: number;
    },
  ): Promise<Array<TransactionEntity & { account?: { id: string; name: string; type: string }; category?: { id: string; name: string; type: string } | null }>> {
    const where: Prisma.TransactionWhereInput = {
      tenantId,
      isDeleted: false,
      ...(options?.accountId && { accountId: options.accountId }),
      ...(options?.categoryId && { categoryId: options.categoryId }),
      ...(options?.type && { type: options.type }),
      ...(options?.startDate && { date: { gte: options.startDate } }),
      ...(options?.endDate && { date: { lte: options.endDate } }),
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
      include: {
        account: {
          select: { id: true, name: true, type: true },
        },
        category: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    return transactions.map((t) => ({
      ...TransactionEntity.fromPrisma(t),
      account: t.account ? { id: t.account.id, name: t.account.name, type: t.account.type } : undefined,
      category: t.category ? { id: t.category.id, name: t.category.name, type: t.category.type } : null,
    }));
  }

  /**
   * Calculate total amounts by type for a period
   */
  async getTotals(
    tenantId: string,
    options?: { startDate?: Date; endDate?: Date; accountId?: string },
  ): Promise<{ income: Money; expense: Money }> {
    const whereBase: Prisma.TransactionWhereInput = {
      tenantId,
      isDeleted: false,
      ...(options?.accountId && { accountId: options.accountId }),
      ...(options?.startDate || options?.endDate
        ? { date: { ...(options.startDate && { gte: options.startDate }), ...(options.endDate && { lte: options.endDate }) } }
        : {}),
    };

    const [incomeResult, expenseResult] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...whereBase, type: 'income' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...whereBase, type: 'expense' },
        _sum: { amount: true },
      }),
    ]);

    return {
      income: incomeResult._sum.amount ? Money.fromPrisma(incomeResult._sum.amount) : Money.zero(),
      expense: expenseResult._sum.amount ? Money.fromPrisma(expenseResult._sum.amount) : Money.zero(),
    };
  }
}
