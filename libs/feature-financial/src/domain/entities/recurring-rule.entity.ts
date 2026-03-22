import { RecurringRule } from '@prisma/client';
import { Money } from '../value-objects/money.vo';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export class RecurringRuleEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly accountId: string,
    public readonly categoryId: string | null,
    public readonly amount: Money,
    public readonly type: 'income' | 'expense',
    public readonly payee: string | null,
    public readonly description: string | null,
    public readonly frequency: RecurringFrequency,
    public readonly interval: number,
    public readonly dayOfMonth: number | null,
    public readonly dayOfWeek: number | null,
    public readonly monthOfYear: number | null,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly nextRunAt: Date | null,
    public readonly lastRunAt: Date | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(rule: RecurringRule): RecurringRuleEntity {
    return new RecurringRuleEntity(
      rule.id,
      rule.tenantId,
      rule.accountId,
      rule.categoryId,
      Money.fromPrisma(rule.amount),
      rule.type as 'income' | 'expense',
      rule.payee,
      rule.description,
      rule.frequency as RecurringFrequency,
      rule.interval,
      rule.dayOfMonth,
      rule.dayOfWeek,
      rule.monthOfYear,
      rule.startDate,
      rule.endDate,
      rule.nextRunAt,
      rule.lastRunAt,
      rule.isActive,
      rule.createdAt,
      rule.updatedAt,
    );
  }

  isExpired(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  }

  shouldRun(): boolean {
    if (!this.isActive || this.isExpired()) return false;
    if (!this.nextRunAt) return false;
    return new Date() >= this.nextRunAt;
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      accountId: this.accountId,
      categoryId: this.categoryId,
      amount: this.amount.toString(),
      type: this.type,
      payee: this.payee,
      description: this.description,
      frequency: this.frequency,
      interval: this.interval,
      dayOfMonth: this.dayOfMonth,
      dayOfWeek: this.dayOfWeek,
      monthOfYear: this.monthOfYear,
      startDate: this.startDate,
      endDate: this.endDate,
      nextRunAt: this.nextRunAt,
      lastRunAt: this.lastRunAt,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
