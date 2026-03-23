import { Injectable, Logger } from '@nestjs/common';
import { FullTextSearchService } from '../../infrastructure/services/full-text-search.service';
import { NoteEntity } from '../../domain/entities/note.entity';
import { SearchNotesDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

export interface SearchResult {
  notes: NoteEntity[];
  total: number;
  query: string;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly fullTextSearchService: FullTextSearchService) {}

  async searchNotes(dto: SearchNotesDto): Promise<SearchResult> {
    const tenantId = this.getTenantId();
    this.logger.log(`Searching notes: "${dto.q}"`);

    const { notes, total } = await this.fullTextSearchService.searchNotes(
      dto.q,
      tenantId,
      dto.limit,
    );

    return {
      notes,
      total,
      query: dto.q,
    };
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
