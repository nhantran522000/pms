import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { RecurringRuleEntity, RecurringFrequency } from '../../domain/entities/recurring-rule.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { Prisma } from '@prisma/client';

export interface CreateRecurringRuleInput {
  tenantId: string;
  accountId: string;
  categoryId: string | null;
  amount: Money;
  type: 'income' | 'expense';
  payee: string | null;
  description: string | null;
  frequency: RecurringFrequency;
  interval: number;
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  monthOfYear: number | null;
  startDate: Date;
  endDate: Date | null;
  nextRunAt: Date;
  isActive?: boolean;
}

@Injectable()
export class RecurringRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRecurringRuleInput): Promise<RecurringRuleEntity> {
    const rule = await this.prisma.recurringRule.create({
      data: {
        tenantId: input.tenantId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        amount: input.amount.toPrisma(),
        type: input.type,
        payee: input.payee,
        description: input.description,
        frequency: input.frequency,
        interval: input.interval,
        dayOfMonth: input.dayOfMonth,
        dayOfWeek: input.dayOfWeek,
        monthOfYear: input.monthOfYear,
        startDate: input.startDate,
        endDate: input.endDate,
        nextRunAt: input.nextRunAt,
        isActive: true,
      },
    });

    return RecurringRuleEntity.fromPrisma(rule);
  }

  async findById(id: string, tenantId: string): Promise<RecurringRuleEntity | null> {
    const rule = await this.prisma.recurringRule.findFirst({
      where: { id, tenantId },
    });
    return rule ? RecurringRuleEntity.fromPrisma(rule) : null;
  }

  async findAll(tenantId: string, includeInactive = false): Promise<RecurringRuleEntity[]> {
    const rules = await this.prisma.recurringRule.findMany({
      where: {
        tenantId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return rules.map((r) => RecurringRuleEntity.fromPrisma(r));
  }

  async findDueForExecution(): Promise<RecurringRuleEntity[]> {
    const now = new Date();

    const rules = await this.prisma.recurringRule.findMany({
      where: {
        isActive: true,
        nextRunAt: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
    });

    return rules.map((r) => RecurringRuleEntity.fromPrisma(r));
  }

  async update(id: string, tenantId: string, input: Partial<CreateRecurringRuleInput>): Promise<RecurringRuleEntity> {
    const data: Prisma.RecurringRuleUpdateInput = {};

    if (input.categoryId !== undefined) {
      data.category = input.categoryId ? { connect: { id: input.categoryId } } : { disconnect: true };
    }
    if (input.amount !== undefined) data.amount = input.amount.toPrisma();
    if (input.payee !== undefined) data.payee = input.payee;
    if (input.description !== undefined) data.description = input.description;
    if (input.endDate !== undefined) data.endDate = input.endDate;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.nextRunAt !== undefined) data.nextRunAt = input.nextRunAt;

    const rule = await this.prisma.recurringRule.update({
      where: { id },
      data,
    });

    return RecurringRuleEntity.fromPrisma(rule);
  }

  async markExecuted(id: string, nextRunAt: Date): Promise<RecurringRuleEntity> {
    const rule = await this.prisma.recurringRule.update({
      where: { id },
      data: {
        lastRunAt: new Date(),
        nextRunAt,
      },
    });

    return RecurringRuleEntity.fromPrisma(rule);
  }

  async setNextRunAt(id: string, nextRunAt: Date): Promise<RecurringRuleEntity> {
    const rule = await this.prisma.recurringRule.update({
      where: { id },
      data: { nextRunAt },
    });

    return RecurringRuleEntity.fromPrisma(rule);
  }

  async deactivate(id: string): Promise<RecurringRuleEntity> {
    const rule = await this.prisma.recurringRule.update({
      where: { id },
      data: { isActive: false },
    });

    return RecurringRuleEntity.fromPrisma(rule);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.recurringRule.delete({
      where: { id },
    });
  }

  /**
   * Calculate next run date based on frequency and interval
   */
  calculateNextRun(rule: RecurringRuleEntity, fromDate: Date = new Date()): Date {
    const next = new Date(fromDate);

    switch (rule.frequency) {
      case 'daily':
        next.setDate(next.getDate() + rule.interval);
        break;

      case 'weekly':
        next.setDate(next.getDate() + 7 * rule.interval);
        // Adjust to specific day of week if set
        if (rule.dayOfWeek !== null) {
          const currentDay = next.getDay();
          const daysUntilTarget = (rule.dayOfWeek - currentDay + 7) % 7;
          next.setDate(next.getDate() + daysUntilTarget);
        }
        break;

      case 'monthly':
        next.setMonth(next.getMonth() + rule.interval);
        // Set specific day of month if set
        if (rule.dayOfMonth !== null) {
          const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
          next.setDate(Math.min(rule.dayOfMonth, lastDayOfMonth));
        }
        break;

      case 'yearly':
        next.setFullYear(next.getFullYear() + rule.interval);
        // Set specific month if set
        if (rule.monthOfYear !== null) {
          next.setMonth(rule.monthOfYear - 1); // JS months are 0-indexed
        }
        // Set specific day if set
        if (rule.dayOfMonth !== null) {
          const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
          next.setDate(Math.min(rule.dayOfMonth, lastDayOfMonth));
        }
        break;
    }

    return next;
  }
}
