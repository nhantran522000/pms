import { Note } from '@prisma/client';

interface TagWithPrisma {
  id: string;
  name: string;
}

export class NoteEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly title: string,
    public readonly content: Record<string, unknown>,
    public readonly folderId: string | null,
    public readonly deletedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly tags: TagWithPrisma[] = [],
  ) {}

  static fromPrisma(note: Note & { tags?: { id: string; name: string }[] }): NoteEntity {
    return new NoteEntity(
      note.id,
      note.tenantId,
      note.title,
      note.content as Record<string, unknown>,
      note.folderId,
      note.deletedAt,
      note.createdAt,
      note.updatedAt,
      note.tags?.map(t => ({ id: t.id, name: t.name })) ?? [],
    );
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      title: this.title,
      content: this.content,
      folderId: this.folderId,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: this.tags,
    };
  }
}
