import { BudgetEnvelope } from '@prisma/client';
import { Money } from '../value-objects/money.vo';

export class BudgetEnvelopeEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly categoryId: string,
    public readonly accountId: string,
    public readonly month: Date,
    public readonly allocated: Money,
    public readonly spent: Money,
    public readonly rolledOver: Money,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(envelope: BudgetEnvelope): BudgetEnvelopeEntity {
    return new BudgetEnvelopeEntity(
      envelope.id,
      envelope.tenantId,
      envelope.categoryId,
      envelope.accountId,
      envelope.month,
      Money.fromPrisma(envelope.allocated),
      Money.fromPrisma(envelope.spent),
      Money.fromPrisma(envelope.rolledOver),
      envelope.createdAt,
      envelope.updatedAt,
    );
  }

  getAvailable(): Money {
    return this.allocated.add(this.rolledOver).subtract(this.spent);
  }

  getRemaining(): Money {
    return this.allocated.subtract(this.spent);
  }

  isOverBudget(): boolean {
    return this.spent.isGreaterThan(this.allocated.add(this.rolledOver));
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      categoryId: this.categoryId,
      accountId: this.accountId,
      month: this.month,
      allocated: this.allocated.toString(),
      spent: this.spent.toString(),
      rolledOver: this.rolledOver.toString(),
      available: this.getAvailable().toString(),
      remaining: this.getRemaining().toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
