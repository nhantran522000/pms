import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryTree,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    this.logger.log(`Creating category: ${dto.name}`);

    // Check for duplicate name
    const existing = await this.categoryRepository.findByName(dto.name, tenantId);
    if (existing) {
      throw new Error(`Category with name "${dto.name}" already exists`);
    }

    return this.categoryRepository.create({ ...dto, tenantId });
  }

  async findById(id: string): Promise<CategoryEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const category = await this.categoryRepository.findById(id, tenantId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.categoryRepository.findAll(tenantId);
  }

  async findByType(type: 'income' | 'expense'): Promise<CategoryEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.categoryRepository.findByType(tenantId, type);
  }

  async getTree(): Promise<CategoryTree[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const allCategories = await this.categoryRepository.findAll(tenantId);
    return this.buildTree(allCategories);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Verify category exists
    const existing = await this.categoryRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate name if changing
    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.categoryRepository.findByName(dto.name, tenantId);
      if (duplicate) {
        throw new Error(`Category with name "${dto.name}" already exists`);
      }
    }

    this.logger.log(`Updating category: ${id}`);
    return this.categoryRepository.update(id, tenantId, dto);
  }

  async delete(id: string): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Verify category exists
    const existing = await this.categoryRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing.isSystem) {
      throw new Error('Cannot delete system categories');
    }

    this.logger.log(`Deleting category: ${id}`);
    await this.categoryRepository.delete(id, tenantId);
  }

  /**
   * Build a tree structure from flat category list
   */
  private buildTree(categories: CategoryEntity[]): CategoryTree[] {
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // First pass: create all nodes
    for (const category of categories) {
      categoryMap.set(category.id, {
        ...category.toJSON(),
        children: [],
      });
    }

    // Second pass: build tree
    for (const category of categories) {
      const node = categoryMap.get(category.id)!;
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children!.push(node);
      } else {
        rootCategories.push(node);
      }
    }

    return rootCategories;
  }
}
