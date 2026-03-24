import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { FolderEntity } from '../../domain/entities/folder.entity';
import { Prisma } from '@prisma/client';

export interface CreateFolderInput {
  tenantId: string;
  name: string;
}

@Injectable()
export class FolderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateFolderInput): Promise<FolderEntity> {
    const folder = await this.prisma.folder.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
      }
    });

    return FolderEntity.fromPrisma(folder, 0);
  }

  async findById(id: string, tenantId: string): Promise<FolderEntity | null> {
    const folder = await this.prisma.folder.findFirst({
      where: { id, tenantId }
    });

    if (!folder) return null;

    const noteCount = await this.prisma.note.count({
      where: { folderId: id, tenantId, deletedAt: null }
    });

    return FolderEntity.fromPrisma(folder, noteCount);
  }

  async findAll(tenantId: string): Promise<FolderEntity[]> {
    const folders = await this.prisma.folder.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    // Get note counts for all folders
    const noteCounts = await this.prisma.note.groupBy({
      by: ['folderId'],
      where: { tenantId, deletedAt: null, folderId: { not: null } },
      _count: { id: true }
    });

    const countMap = new Map(noteCounts.map(nc => [nc.folderId as string, nc._count.id]));

    return folders.map(f => FolderEntity.fromPrisma(f, countMap.get(f.id) ?? 0));
  }

  async update(id: string, tenantId: string, name: string): Promise<FolderEntity> {
    const folder = await this.prisma.folder.update({
      where: { id },
      data: { name }
    });

    const noteCount = await this.prisma.note.count({
      where: { folderId: id, tenantId, deletedAt: null }
    });

    return FolderEntity.fromPrisma(folder, noteCount);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // Set folderId to null for all notes in this folder
    await this.prisma.note.updateMany({
      where: { folderId: id, tenantId },
      data: { folderId: null }
    });

    await this.prisma.folder.delete({
      where: { id }
    });
  }
}
