import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  RecurringRuleRepository,
  CreateRecurringRuleInput,
} from '../../infrastructure/repositories/recurring-rule.repository';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { RecurringRuleEntity } from '../../domain/entities/recurring-rule.entity';
import { Money } from '../../domain/value-objects/money.vo';
import {
  CreateRecurringRuleDto,
  UpdateRecurringRuleDto,
  RecurringRuleResponse,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class RecurringTransactionService {
  private readonly logger = new Logger(RecurringTransactionService.name);

  constructor(
    private readonly recurringRuleRepository: RecurringRuleRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Create a new recurring rule
   */
  async create(dto: CreateRecurringRuleDto): Promise<RecurringRuleEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

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
    const startDate = typeof dto.startDate === 'string' ? new Date(dto.startDate) : dto.startDate;
    const endDate = dto.endDate ? (typeof dto.endDate === 'string' ? new Date(dto.endDate) : dto.endDate) : null;

    // Calculate initial nextRunAt based on startDate
    const nextRunAt = this.calculateInitialNextRun(
      startDate,
      dto.frequency,
      dto.interval,
      dto.dayOfMonth,
      dto.dayOfWeek,
      dto.monthOfYear,
    );

    const input: CreateRecurringRuleInput = {
      tenantId,
      accountId: dto.accountId,
      categoryId: dto.categoryId ?? null,
      amount,
      type: dto.type,
      payee: dto.payee ?? null,
      description: dto.description ?? null,
      frequency: dto.frequency,
      interval: dto.interval ?? 1,
      dayOfMonth: dto.dayOfMonth ?? null,
      dayOfWeek: dto.dayOfWeek ?? null,
      monthOfYear: dto.monthOfYear ?? null,
      startDate,
      endDate,
      nextRunAt,
    };

    const rule = await this.recurringRuleRepository.create(input);
    this.logger.log(`Created recurring rule: ${rule.id}, nextRunAt: ${nextRunAt.toISOString()}`);

    return rule;
  }

  /**
   * Get a recurring rule by ID
   */
  async findById(id: string): Promise<RecurringRuleEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const rule = await this.recurringRuleRepository.findById(id, tenantId);
    if (!rule) {
      throw new NotFoundException('Recurring rule not found');
    }

    return rule;
  }

  /**
   * List all recurring rules for the current tenant
   */
  async findAll(includeInactive = false): Promise<RecurringRuleEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    return this.recurringRuleRepository.findAll(tenantId, includeInactive);
  }

  /**
   * Update a recurring rule
   */
  async update(id: string, dto: UpdateRecurringRuleDto): Promise<RecurringRuleEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Verify rule exists
    const existing = await this.recurringRuleRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Recurring rule not found');
    }

    // Verify category if changing
    if (dto.categoryId !== undefined && dto.categoryId !== null) {
      const category = await this.categoryRepository.findById(dto.categoryId, tenantId);
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    const input: Partial<CreateRecurringRuleInput> = {
      categoryId: dto.categoryId ?? null,
      amount: dto.amount ? Money.fromDecimal(dto.amount) : undefined,
      payee: dto.payee ?? null,
      description: dto.description ?? null,
      endDate: dto.endDate ? (typeof dto.endDate === 'string' ? new Date(dto.endDate) : dto.endDate) : dto.endDate,
      isActive: dto.isActive,
    };

    const rule = await this.recurringRuleRepository.update(id, tenantId, input);
    this.logger.log(`Updated recurring rule: ${id}`);

    return rule;
  }

  /**
   * Deactivate a recurring rule
   */
  async deactivate(id: string): Promise<RecurringRuleEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.recurringRuleRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Recurring rule not found');
    }

    const rule = await this.recurringRuleRepository.deactivate(id);
    this.logger.log(`Deactivated recurring rule: ${id}`);

    return rule;
  }

  /**
   * Delete a recurring rule
   */
  async delete(id: string): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.recurringRuleRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Recurring rule not found');
    }

    await this.recurringRuleRepository.delete(id, tenantId);
    this.logger.log(`Deleted recurring rule: ${id}`);
  }

  /**
   * Process a single recurring rule - creates a transaction and updates nextRunAt
   * Called by the pg-boss job handler
   */
  async processRule(ruleId: string): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    this.logger.log(`Processing recurring rule: ${ruleId}`);

    // Get the rule (without tenant context since this runs as a background job)
    const rule = await this.recurringRuleRepository.findById(ruleId, '');
    if (!rule) {
      this.logger.warn(`Recurring rule not found: ${ruleId}`);
      return { success: false, error: 'Rule not found' };
    }

    // Check if rule should run
    if (!rule.shouldRun()) {
      this.logger.debug(`Rule ${ruleId} not due for execution (isActive: ${rule.isActive}, nextRunAt: ${rule.nextRunAt})`);
      return { success: false, error: 'Rule not due for execution' };
    }

    try {
      // Create the transaction
      const transaction = await this.transactionRepository.create({
        tenantId: rule.tenantId,
        accountId: rule.accountId,
        categoryId: rule.categoryId,
        amount: rule.amount,
        type: rule.type,
        payee: rule.payee,
        description: rule.description,
        date: new Date(),
        isRecurring: true,
        recurringRuleId: rule.id,
      });

      // Update account balance
      const balanceAdjustment = rule.type === 'income' ? rule.amount : rule.amount.multiply(-1);
      await this.accountRepository.updateBalance(rule.accountId, rule.tenantId, balanceAdjustment);

      // Calculate and update next run date
      const nextRunAt = this.recurringRuleRepository.calculateNextRun(rule);
      await this.recurringRuleRepository.markExecuted(rule.id, nextRunAt);

      this.logger.log(`Created recurring transaction: ${transaction.id}, nextRunAt: ${nextRunAt.toISOString()}`);

      return { success: true, transactionId: transaction.id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process rule ${ruleId}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Process all due recurring rules
   * Called by the pg-boss scheduled job
   */
  async processAllDue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    this.logger.log('Processing all due recurring rules');

    const dueRules = await this.recurringRuleRepository.findDueForExecution();
    this.logger.log(`Found ${dueRules.length} rules due for execution`);

    let succeeded = 0;
    let failed = 0;

    for (const rule of dueRules) {
      const result = await this.processRule(rule.id);
      if (result.success) {
        succeeded++;
      } else {
        failed++;
        this.logger.warn(`Failed to process rule ${rule.id}: ${result.error}`);
      }
    }

    this.logger.log(`Processed ${dueRules.length} rules: ${succeeded} succeeded, ${failed} failed`);

    return {
      processed: dueRules.length,
      succeeded,
      failed,
    };
  }

  /**
   * Calculate the initial next run date based on start date and frequency
   */
  private calculateInitialNextRun(
    startDate: Date,
    frequency: string,
    interval: number,
    dayOfMonth: number | null,
    dayOfWeek: number | null,
    monthOfYear: number | null,
  ): Date {
    const now = new Date();
    const start = new Date(startDate);

    // If start date is in the future, use it as next run
    if (start > now) {
      return start;
    }

    // Otherwise calculate next occurrence from now
    const next = new Date(now);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + interval);
        break;

      case 'weekly':
        next.setDate(next.getDate() + 7 * interval);
        if (dayOfWeek !== null) {
          const currentDay = next.getDay();
          const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
          next.setDate(next.getDate() + daysUntilTarget);
        }
        break;

      case 'monthly':
        next.setMonth(next.getMonth() + interval);
        if (dayOfMonth !== null) {
          const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
          next.setDate(Math.min(dayOfMonth, lastDayOfMonth));
        }
        break;

      case 'yearly':
        next.setFullYear(next.getFullYear() + interval);
        if (monthOfYear !== null) {
          next.setMonth(monthOfYear - 1);
        }
        if (dayOfMonth !== null) {
          const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
          next.setDate(Math.min(dayOfMonth, lastDayOfMonth));
        }
        break;
    }

    return next;
  }
}
