import { Transaction } from '@prisma/client';
import { Money } from '../value-objects/money.vo';

export class TransactionEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly accountId: string,
    public readonly categoryId: string | null,
    public readonly amount: Money,
    public readonly type: 'income' | 'expense',
    public readonly payee: string | null,
    public readonly description: string | null,
    public readonly date: Date,
    public readonly isRecurring: boolean,
    public readonly recurringRuleId: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(transaction: Transaction): TransactionEntity {
    return new TransactionEntity(
      transaction.id,
      transaction.tenantId,
      transaction.accountId,
      transaction.categoryId,
      Money.fromPrisma(transaction.amount),
      transaction.type as 'income' | 'expense',
      transaction.payee,
      transaction.description,
      transaction.date,
      transaction.isRecurring,
      transaction.recurringRuleId,
      transaction.isDeleted,
      transaction.createdAt,
      transaction.updatedAt,
    );
  }

  isIncome(): boolean {
    return this.type === 'income';
  }

  isExpense(): boolean {
    return this.type === 'expense';
  }

  getSignedAmount(): Money {
    return this.isExpense() ? this.amount.multiply(-1) : this.amount;
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
      date: this.date,
      isRecurring: this.isRecurring,
      recurringRuleId: this.recurringRuleId,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
