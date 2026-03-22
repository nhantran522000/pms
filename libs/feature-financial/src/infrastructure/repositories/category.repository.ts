import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '@pms/shared-types';

export interface CreateCategoryInput extends CreateCategoryDto {
  tenantId: string;
}

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCategoryInput): Promise<CategoryEntity> {
    // Verify parent exists and belongs to same tenant if provided
    if (input.parentId) {
      const parent = await this.prisma.category.findFirst({
        where: { id: input.parentId, tenantId: input.tenantId },
      });
      if (!parent) {
        throw new ConflictException('Parent category not found');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        parentId: input.parentId ?? null,
        type: input.type,
        icon: input.icon,
        color: input.color,
        isSystem: false,
      },
    });

    return CategoryEntity.fromPrisma(category);
  }

  async findById(id: string, tenantId: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findFirst({
      where: { id, tenantId },
    });
    return category ? CategoryEntity.fromPrisma(category) : null;
  }

  async findByName(name: string, tenantId: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findFirst({
      where: { name, tenantId },
    });
    return category ? CategoryEntity.fromPrisma(category) : null;
  }

  async findAll(tenantId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { tenantId },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    return categories.map((c) => CategoryEntity.fromPrisma(c));
  }

  async findByType(tenantId: string, type: 'income' | 'expense'): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { tenantId, type },
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => CategoryEntity.fromPrisma(c));
  }

  async findRootCategories(tenantId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { tenantId, parentId: null },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    return categories.map((c) => CategoryEntity.fromPrisma(c));
  }

  async findChildren(parentId: string, tenantId: string): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { parentId, tenantId },
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => CategoryEntity.fromPrisma(c));
  }

  async update(id: string, tenantId: string, input: UpdateCategoryDto): Promise<CategoryEntity> {
    // Verify parent exists if changing
    if (input.parentId !== undefined) {
      if (input.parentId) {
        const parent = await this.prisma.category.findFirst({
          where: { id: input.parentId, tenantId },
        });
        if (!parent) {
          throw new ConflictException('Parent category not found');
        }
        // Prevent making category a child of itself
        if (input.parentId === id) {
          throw new ConflictException('Category cannot be its own parent');
        }
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        parentId: input.parentId,
        icon: input.icon,
        color: input.color,
      },
    });

    return CategoryEntity.fromPrisma(category);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // Check if category has transactions
    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId: id, tenantId },
    });

    if (transactionCount > 0) {
      throw new ConflictException(
        'Cannot delete category with transactions. Move transactions first.',
      );
    }

    // Check if category has children
    const childCount = await this.prisma.category.count({
      where: { parentId: id, tenantId },
    });

    if (childCount > 0) {
      throw new ConflictException(
        'Cannot delete category with children. Delete or move children first.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  async countTransactions(id: string, tenantId: string): Promise<number> {
    return this.prisma.transaction.count({
      where: { categoryId: id, tenantId },
    });
  }
}
