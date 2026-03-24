import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { NoteEntity } from '../../domain/entities/note.entity';
import { Prisma } from '@prisma/client';

export interface CreateNoteInput {
  tenantId: string;
  title: string;
  content: Record<string, unknown>;
  folderId?: string | null;
}

export interface UpdateNoteInput {
  title?: string;
  content?: Record<string, unknown>;
  folderId?: string | null;
}

@Injectable()
export class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateNoteInput, tagIds: string[] = []): Promise<NoteEntity> {
    const note = await this.prisma.note.create({
      data: {
        tenantId: input.tenantId,
        title: input.title,
        content: input.content as Prisma.JsonValue,
        folderId: input.folderId ?? null,
        noteTags: tagIds.length > 0 ? {
          create: tagIds.map(tagId => ({ tagId }))
        } : undefined,
      },
      include: {
        noteTags: {
          include: { tag: true }
        }
      }
    });

    return NoteEntity.fromPrisma({
      ...note,
      tags: note.noteTags.map(nt => ({ id: nt.tag.id, name: nt.tag.name }))
    });
  }

  async findById(id: string, tenantId: string): Promise<NoteEntity | null> {
    const note = await this.prisma.note.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        noteTags: {
          include: { tag: true }
        }
      }
    });

    if (!note) return null;

    return NoteEntity.fromPrisma({
      ...note,
      tags: note.noteTags.map(nt => ({ id: nt.tag.id, name: nt.tag.name }))
    });
  }

  async findAll(tenantId: string, folderId?: string): Promise<NoteEntity[]> {
    const where: Prisma.NoteWhereInput = {
      tenantId,
      deletedAt: null,
      ...(folderId !== undefined && { folderId: folderId ?? null })
    };

    const notes = await this.prisma.note.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        noteTags: {
          include: { tag: true }
        }
      }
    });

    return notes.map(n => NoteEntity.fromPrisma({
      ...n,
      tags: n.noteTags.map(nt => ({ id: nt.tag.id, name: nt.tag.name }))
    }));
  }

  async update(id: string, tenantId: string, input: UpdateNoteInput, tagIds?: string[]): Promise<NoteEntity> {
    // Update tags if provided
    if (tagIds !== undefined) {
      await this.prisma.noteTag.deleteMany({
        where: { noteId: id }
      });

      if (tagIds.length > 0) {
        await this.prisma.noteTag.createMany({
          data: tagIds.map(tagId => ({ noteId: id, tagId }))
        });
      }
    }

    const data: Prisma.NoteUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.content !== undefined) data.content = input.content as Prisma.JsonValue;
    if (input.folderId !== undefined) data.folder = input.folderId ? { connect: { id: input.folderId } } : { disconnect: true };

    const note = await this.prisma.note.update({
      where: { id },
      data,
      include: {
        noteTags: {
          include: { tag: true }
        }
      }
    });

    return NoteEntity.fromPrisma({
      ...note,
      tags: note.noteTags.map(nt => ({ id: nt.tag.id, name: nt.tag.name }))
    });
  }

  async softDelete(id: string, tenantId: string): Promise<NoteEntity> {
    const note = await this.prisma.note.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        noteTags: {
          include: { tag: true }
        }
      }
    });

    return NoteEntity.fromPrisma({
      ...note,
      tags: note.noteTags.map(nt => ({ id: nt.tag.id, name: nt.tag.name }))
    });
  }

  async countByFolder(folderId: string, tenantId: string): Promise<number> {
    return this.prisma.note.count({
      where: { folderId, tenantId, deletedAt: null }
    });
  }
}
