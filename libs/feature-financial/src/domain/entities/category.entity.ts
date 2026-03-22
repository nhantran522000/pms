import { Category } from '@prisma/client';

export class CategoryEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly parentId: string | null,
    public readonly icon: string | null,
    public readonly color: string | null,
    public readonly type: 'income' | 'expense',
    public readonly isSystem: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(category: Category): CategoryEntity {
    return new CategoryEntity(
      category.id,
      category.tenantId,
      category.name,
      category.parentId,
      category.icon,
      category.color,
      category.type as 'income' | 'expense',
      category.isSystem,
      category.createdAt,
      category.updatedAt,
    );
  }

  isIncome(): boolean {
    return this.type === 'income';
  }

  isExpense(): boolean {
    return this.type === 'expense';
  }

  isChild(): boolean {
    return this.parentId !== null;
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      parentId: this.parentId,
      icon: this.icon,
      color: this.color,
      type: this.type,
      isSystem: this.isSystem,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
