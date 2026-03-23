import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { SearchService } from '../../application/services/search.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { SearchNotesSchema, SearchNotesDto } from '@pms/shared-types';

@Controller('notes')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(SearchNotesSchema, 'query')) dto: SearchNotesDto,
  ) {
    const result = await this.searchService.searchNotes(dto);
    return {
      success: true,
      data: {
        notes: result.notes.map((n) => n.toJSON()),
        total: result.total,
        query: result.query,
      },
    };
  }
}
