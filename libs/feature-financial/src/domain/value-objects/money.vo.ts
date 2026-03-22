import Decimal from 'decimal.js';

export class Money {
  private constructor(private readonly amount: Decimal) {
    if (amount.isNaN()) {
      throw new Error('Money amount cannot be NaN');
    }
  }

  static fromDecimal(value: Decimal | string | number): Money {
    return new Money(new Decimal(value));
  }

  static fromPrisma(value: Decimal): Money {
    return new Money(value);
  }

  static zero(): Money {
    return new Money(new Decimal(0));
  }

  get value(): Decimal {
    return this.amount;
  }

  add(other: Money): Money {
    return new Money(this.amount.plus(other.amount));
  }

  subtract(other: Money): Money {
    return new Money(this.amount.minus(other.amount));
  }

  multiply(factor: number | string | Decimal): Money {
    return new Money(this.amount.times(factor));
  }

  divide(divisor: number | string | Decimal): Money {
    if (new Decimal(divisor).isZero()) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount.dividedBy(divisor));
  }

  isPositive(): boolean {
    return this.amount.isPositive();
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  isGreaterThan(other: Money): boolean {
    return this.amount.greaterThan(other.amount);
  }

  isLessThan(other: Money): boolean {
    return this.amount.lessThan(other.amount);
  }

  equals(other: Money): boolean {
    return this.amount.equals(other.amount);
  }

  toNumber(): number {
    return this.amount.toNumber();
  }

  toString(): string {
    return this.amount.toFixed(2);
  }

  toPrisma(): Decimal {
    return this.amount;
  }

  toJSON(): string {
    return this.toString();
  }
}
