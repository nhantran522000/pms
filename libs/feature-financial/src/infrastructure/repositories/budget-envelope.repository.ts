import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { BudgetEnvelopeEntity } from '../../domain/entities/budget-envelope.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { AllocateBudgetDto } from '@pms/shared-types';

export interface UpsertBudgetInput extends AllocateBudgetDto {
  rolledOver?: Money;
}

@Injectable()
export class BudgetEnvelopeRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create or update budget allocation for a category/month
   */
  async upsert(
    tenantId: string,
    input: UpsertBudgetInput,
  ): Promise<BudgetEnvelopeEntity> {
    // Parse month string to Date (first day of month)
    const [year, month] = input.month.split('-').map(Number);
    const monthDate = new Date(year, month - 1, 1);

    const envelope = await this.prisma.budgetEnvelope.upsert({
      where: {
        tenantId_categoryId_accountId_month: {
          tenantId,
          categoryId: input.categoryId,
          accountId: input.accountId,
          month: monthDate,
        },
      },
      update: {
        allocated: Money.fromDecimal(input.allocated).toPrisma(),
      },
      create: {
        tenantId,
        categoryId: input.categoryId,
        accountId: input.accountId,
        month: monthDate,
        allocated: Money.fromDecimal(input.allocated).toPrisma(),
        spent: Money.zero().toPrisma(),
        rolledOver: input.rolledOver?.toPrisma() ?? Money.zero().toPrisma(),
      },
    });

    return BudgetEnvelopeEntity.fromPrisma(envelope);
  }

  async findById(id: string, tenantId: string): Promise<BudgetEnvelopeEntity | null> {
    const envelope = await this.prisma.budgetEnvelope.findFirst({
      where: { id, tenantId },
    });
    return envelope ? BudgetEnvelopeEntity.fromPrisma(envelope) : null;
  }

  async findByCategoryMonth(
    categoryId: string,
    accountId: string,
    month: string,
    tenantId: string,
  ): Promise<BudgetEnvelopeEntity | null> {
    const [year, m] = month.split('-').map(Number);
    const monthDate = new Date(year, m - 1, 1);

    const envelope = await this.prisma.budgetEnvelope.findUnique({
      where: {
        tenantId_categoryId_accountId_month: {
          tenantId,
          categoryId,
          accountId,
          month: monthDate,
        },
      },
    });

    return envelope ? BudgetEnvelopeEntity.fromPrisma(envelope) : null;
  }

  async findByMonth(month: string, tenantId: string): Promise<BudgetEnvelopeEntity[]> {
    const [year, m] = month.split('-').map(Number);
    const monthDate = new Date(year, m - 1, 1);

    const envelopes = await this.prisma.budgetEnvelope.findMany({
      where: { tenantId, month: monthDate },
      orderBy: { createdAt: 'asc' },
    });

    return envelopes.map((e) => BudgetEnvelopeEntity.fromPrisma(e));
  }

  async findByMonthWithCategories(
    month: string,
    tenantId: string,
  ): Promise<Array<BudgetEnvelopeEntity & { category?: { id: string; name: string } }>> {
    const [year, m] = month.split('-').map(Number);
    const monthDate = new Date(year, m - 1, 1);

    const envelopes = await this.prisma.budgetEnvelope.findMany({
      where: { tenantId, month: monthDate },
      orderBy: { createdAt: 'asc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return envelopes.map((e) => ({
      ...BudgetEnvelopeEntity.fromPrisma(e),
      category: e.category,
    }));
  }

  async updateSpent(
    id: string,
    spent: Money,
  ): Promise<BudgetEnvelopeEntity> {
    const envelope = await this.prisma.budgetEnvelope.update({
      where: { id },
      data: { spent: spent.toPrisma() },
    });

    return BudgetEnvelopeEntity.fromPrisma(envelope);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.budgetEnvelope.delete({
      where: { id },
    });
  }

  /**
   * Get previous month's envelope for rollover calculation
   */
  async getPreviousMonth(
    categoryId: string,
    accountId: string,
    currentMonth: string,
    tenantId: string,
  ): Promise<BudgetEnvelopeEntity | null> {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonthDate = new Date(year, month - 2, 1); // month - 2 because JS months are 0-indexed

    const envelope = await this.prisma.budgetEnvelope.findUnique({
      where: {
        tenantId_categoryId_accountId_month: {
          tenantId,
          categoryId,
          accountId,
          month: prevMonthDate,
        },
      },
    });

    return envelope ? BudgetEnvelopeEntity.fromPrisma(envelope) : null;
  }

  /**
   * Calculate total allocations for a month
   */
  async getMonthTotals(
    month: string,
    tenantId: string,
  ): Promise<{ allocated: Money; spent: Money; rolledOver: Money; available: Money }> {
    const envelopes = await this.findByMonth(month, tenantId);

    let totalAllocated = Money.zero();
    let totalSpent = Money.zero();
    let totalRolledOver = Money.zero();

    for (const envelope of envelopes) {
      totalAllocated = totalAllocated.add(envelope.allocated);
      totalSpent = totalSpent.add(envelope.spent);
      totalRolledOver = totalRolledOver.add(envelope.rolledOver);
    }

    const totalAvailable = totalAllocated.add(totalRolledOver).subtract(totalSpent);

    return {
      allocated: totalAllocated,
      spent: totalSpent,
      rolledOver: totalRolledOver,
      available: totalAvailable,
    };
  }
}
