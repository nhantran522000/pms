import { Account } from '@prisma/client';
import { Money } from '../value-objects/money.vo';

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit';

export class AccountEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly initialBalance: Money,
    public readonly currentBalance: Money,
    public readonly icon: string | null,
    public readonly color: string | null,
    public readonly isArchived: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(account: Account): AccountEntity {
    return new AccountEntity(
      account.id,
      account.tenantId,
      account.name,
      account.type as AccountType,
      Money.fromPrisma(account.initialBalance),
      Money.fromPrisma(account.currentBalance),
      account.icon,
      account.color,
      account.isArchived,
      account.createdAt,
      account.updatedAt,
    );
  }

  isActive(): boolean {
    return !this.isArchived;
  }

  getBalanceChange(): Money {
    return this.currentBalance.subtract(this.initialBalance);
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      type: this.type,
      initialBalance: this.initialBalance.toString(),
      currentBalance: this.currentBalance.toString(),
      icon: this.icon,
      color: this.color,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
