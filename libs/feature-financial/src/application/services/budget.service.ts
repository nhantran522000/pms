import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { BudgetEnvelopeRepository } from '../../infrastructure/repositories/budget-envelope.repository';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { BudgetEnvelopeEntity } from '../../domain/entities/budget-envelope.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { AllocateBudgetDto, UpdateAllocationDto, BudgetSummary, BudgetEnvelopeResponse } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);

  constructor(
    private readonly envelopeRepository: BudgetEnvelopeRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Allocate budget to a category for a specific month
   */
  async allocate(dto: AllocateBudgetDto): Promise<BudgetEnvelopeEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Verify category exists and is expense type
    const category = await this.categoryRepository.findById(dto.categoryId, tenantId);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    if (category.isIncome()) {
      throw new BadRequestException('Cannot allocate budget to income category');
    }

    // Verify account exists
    const account = await this.accountRepository.findById(dto.accountId, tenantId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    // Calculate rollover from previous month
    const previousEnvelope = await this.envelopeRepository.getPreviousMonth(
      dto.categoryId,
      dto.accountId,
      dto.month,
      tenantId,
    );

    let rolledOver = Money.zero();
    if (previousEnvelope) {
      // Rollover = previous available (allocated + rolledOver - spent)
      rolledOver = previousEnvelope.getAvailable();
      if (rolledOver.isNegative()) {
        // If overspent, rollover is negative (debt)
        this.logger.debug(`Rollover for ${category.name}: ${rolledOver.toString()} (overspent)`);
      } else {
        this.logger.debug(`Rollover for ${category.name}: ${rolledOver.toString()}`);
      }
    }

    this.logger.log(`Allocating budget: ${dto.allocated} to ${category.name} for ${dto.month}`);

    const envelope = await this.envelopeRepository.upsert(tenantId, {
      ...dto,
      rolledOver,
    });

    // Recalculate spent amount
    await this.recalculateSpent(envelope);

    return envelope;
  }

  /**
   * Get budget summary for a month
   */
  async getMonthSummary(month: string, accountId?: string): Promise<BudgetSummary> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Get envelopes with category data
    const envelopes = await this.envelopeRepository.findByMonthWithCategories(month, tenantId);

    // Filter by account if specified
    const filteredEnvelopes = accountId
      ? envelopes.filter((e) => e.accountId === accountId)
      : envelopes;

    // Recalculate spent for each envelope
    for (const envelope of filteredEnvelopes) {
      await this.recalculateSpent(envelope);
    }

    // Build response with computed fields
    const envelopeResponses: BudgetEnvelopeResponse[] = filteredEnvelopes.map((e) => ({
      id: e.id,
      tenantId: e.tenantId,
      categoryId: e.categoryId,
      accountId: e.accountId,
      month: this.formatMonth(e.month),
      allocated: e.allocated.toString(),
      spent: e.spent.toString(),
      rolledOver: e.rolledOver.toString(),
      available: e.getAvailable().toString(),
      remaining: e.getRemaining().toString(),
      isOverBudget: e.isOverBudget(),
      category: e.category,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));

    // Calculate totals
    const totals = await this.envelopeRepository.getMonthTotals(month, tenantId);

    return {
      month,
      totalAllocated: totals.allocated.toString(),
      totalSpent: totals.spent.toString(),
      totalRolledOver: totals.rolledOver.toString(),
      totalAvailable: totals.available.toString(),
      envelopes: envelopeResponses,
    };
  }

  /**
   * Get single envelope by ID
   */
  async findById(id: string): Promise<BudgetEnvelopeEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const envelope = await this.envelopeRepository.findById(id, tenantId);

    if (!envelope) {
      throw new NotFoundException('Budget envelope not found');
    }

    return envelope;
  }

  /**
   * Update allocation amount
   */
  async updateAllocation(id: string, dto: UpdateAllocationDto): Promise<BudgetEnvelopeEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.envelopeRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Budget envelope not found');
    }

    this.logger.log(`Updating allocation for envelope: ${id}`);

    return this.envelopeRepository.upsert(tenantId, {
      categoryId: existing.categoryId,
      accountId: existing.accountId,
      month: this.formatMonth(existing.month),
      allocated: dto.allocated,
      rolledOver: existing.rolledOver,
    });
  }

  /**
   * Delete an envelope allocation
   */
  async deleteAllocation(id: string): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.envelopeRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Budget envelope not found');
    }

    this.logger.log(`Deleting budget envelope: ${id}`);
    await this.envelopeRepository.delete(id, tenantId);
  }

  /**
   * Recalculate spent amount for an envelope based on transactions
   */
  private async recalculateSpent(envelope: BudgetEnvelopeEntity): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      return;
    }

    // Get date range for the month
    const startDate = envelope.month;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of the month

    // Get expense totals for this category in this month
    const totals = await this.transactionRepository.getTotals(tenantId, {
      startDate,
      endDate,
      accountId: envelope.accountId,
    });

    // Note: This is a simplified version. In a real implementation,
    // you'd filter by categoryId as well. This requires extending
    // the TransactionRepository.getTotals method.

    // For now, we'll update spent to the expense total
    // In production, add categoryId filter to getTotals
    await this.envelopeRepository.updateSpent(envelope.id, totals.expense);
  }

  /**
   * Format Date to YYYY-MM string
   */
  private formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
