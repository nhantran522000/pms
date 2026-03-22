import { Injectable, Logger } from '@nestjs/common';
import { AiGatewayService } from '@pms/shared-kernel';
import { CategoryRepository } from '../../infrastructure/repositories/category.repository';
import { CategorizeTransactionDto, CategorySuggestion } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class AiCategorizationService {
  private readonly logger = new Logger(AiCategorizationService.name);

  constructor(
    private readonly aiGateway: AiGatewayService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Suggest a category for a transaction based on payee/description
   */
  async categorize(dto: CategorizeTransactionDto): Promise<CategorySuggestion> {
    const tenantId = getTenantId();

    // Build prompt from available information
    const parts: string[] = [];
    if (dto.payee) parts.push(`Payee: ${dto.payee}`);
    if (dto.description) parts.push(`Description: ${dto.description}`);

    if (parts.length === 0) {
      return {
        categoryId: null,
        categoryName: 'Uncategorized',
        confidence: 0,
      };
    }

    // Get available categories for context
    const categories = await this.categoryRepository.findAll(tenantId);
    const categoryNames = categories
      .filter((c) => !dto.type || c.type === dto.type)
      .map((c) => c.name);

    const prompt = `Categorize this transaction into one of these categories: ${categoryNames.join(', ')}

Transaction details:
${parts.join('\n')}

Return the most appropriate category name.`;

    this.logger.debug(`Categorizing transaction: ${parts.join(', ')}`);

    // Call AI Gateway with CLASSIFY task type
    const response = await this.aiGateway.execute({
      taskType: 'CLASSIFY',
      prompt,
      context: {
        availableCategories: categoryNames,
        transactionType: dto.type,
      },
    });

    if (!response.success || !response.result) {
      this.logger.warn(`AI categorization failed: ${response.error}`);
      return {
        categoryId: null,
        categoryName: 'Uncategorized',
        confidence: 0,
      };
    }

    // Extract classification result
    const classifyResult = response.result as { category: string; confidence: number; alternatives?: Array<{ category: string; confidence: number }> };

    // Resolve category name to ID
    const matchedCategory = this.findBestCategoryMatch(
      classifyResult.category,
      categories,
    );

    // Build alternatives with resolved IDs
    const alternatives = classifyResult.alternatives?.map((alt) => {
      const altCategory = this.findBestCategoryMatch(alt.category, categories);
      return {
        categoryId: altCategory?.id ?? null,
        categoryName: alt.category,
        confidence: alt.confidence,
      };
    });

    return {
      categoryId: matchedCategory?.id ?? null,
      categoryName: classifyResult.category,
      confidence: classifyResult.confidence,
      alternatives,
    };
  }

  /**
   * Get category suggestions for bulk categorization
   */
  async batchCategorize(
    transactions: Array<{ id: string; payee?: string; description?: string; type?: 'income' | 'expense' }>,
  ): Promise<Map<string, CategorySuggestion>> {
    const results = new Map<string, CategorySuggestion>();

    // Process in parallel with Promise.all
    const suggestions = await Promise.all(
      transactions.map(async (t) => {
        const suggestion = await this.categorize({
          payee: t.payee,
          description: t.description,
          type: t.type,
        });
        return { id: t.id, suggestion };
      }),
    );

    for (const { id, suggestion } of suggestions) {
      results.set(id, suggestion);
    }

    return results;
  }

  /**
   * Find best matching category by name (fuzzy match)
   */
  private findBestCategoryMatch(
    categoryName: string,
    categories: Awaited<ReturnType<CategoryRepository['findAll']>>,
  ): { id: string; name: string } | null {
    // Exact match first
    const exactMatch = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
    );
    if (exactMatch) {
      return { id: exactMatch.id, name: exactMatch.name };
    }

    // Partial match (category name contains search or vice versa)
    const partialMatch = categories.find(
      (c) =>
        c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(c.name.toLowerCase()),
    );
    if (partialMatch) {
      return { id: partialMatch.id, name: partialMatch.name };
    }

    return null;
  }
}
