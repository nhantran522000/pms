import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { NoteEntity } from '../../domain/entities/note.entity';

interface SearchResultRow {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  folderId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  rank: number;
  tags: Array<{ id: string; name: string }>;
}

@Injectable()
export class FullTextSearchService {
  private readonly logger = new Logger(FullTextSearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchNotes(
    query: string,
    tenantId: string,
    limit: number = 20,
  ): Promise<{ notes: NoteEntity[]; total: number }> {
    this.logger.log(`Searching notes for: "${query}" in tenant ${tenantId}`);

    // Convert query to tsquery format (replace spaces with & for AND search)
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => this.sanitizeTerm(term))
      .join(' & ');

    if (!searchQuery) {
      return { notes: [], total: 0 };
    }

    // Use Prisma raw query for full-text search
    const results = await this.prisma.$queryRaw<SearchResultRow[]>`
      SELECT
        n.id,
        n."tenantId",
        n.title,
        n.content,
        n."folderId",
        n."deletedAt",
        n."createdAt",
        n."updatedAt",
        ts_rank(n."search_vector", to_tsquery('english', ${searchQuery})) as rank,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as tags
      FROM "notes" n
      LEFT JOIN "note_tags" nt ON n.id = nt."noteId"
      LEFT JOIN "tags" t ON nt."tagId" = t.id AND t."tenantId" = n."tenantId"
      WHERE n."tenantId" = ${tenantId}
        AND n."deletedAt" IS NULL
        AND n."search_vector" @@ to_tsquery('english', ${searchQuery})
      GROUP BY n.id
      ORDER BY rank DESC
      LIMIT ${limit}
    `;

    // Get total count
    const countResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(DISTINCT n.id) as count
      FROM "notes" n
      WHERE n."tenantId" = ${tenantId}
        AND n."deletedAt" IS NULL
        AND n."search_vector" @@ to_tsquery('english', ${searchQuery})
    `;

    const notes = results.map((row) =>
      NoteEntity.fromPrisma({
        id: row.id,
        tenantId: row.tenantId,
        title: row.title,
        content: row.content as unknown as Record<string, unknown>,
        folderId: row.folderId,
        deletedAt: row.deletedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: row.tags,
      }),
    );

    this.logger.log(`Found ${notes.length} notes for query: "${query}"`);

    return {
      notes,
      total: Number(countResult[0].count),
    };
  }

  private sanitizeTerm(term: string): string {
    // Remove special characters that could break tsquery
    // Keep alphanumeric, hyphens, and underscores
    return term.replace(/[^a-zA-Z0-9_-]/g, '');
  }
}
