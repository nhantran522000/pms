import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { TagEntity } from '../../domain/entities/tag.entity';

export interface CreateTagInput {
  tenantId: string;
  name: string;
}

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTagInput): Promise<TagEntity> {
    const tag = await this.prisma.tag.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
      }
    });

    return TagEntity.fromPrisma(tag);
  }

  async findById(id: string, tenantId: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findFirst({
      where: { id, tenantId }
    });

    return tag ? TagEntity.fromPrisma(tag) : null;
  }

  async findByName(name: string, tenantId: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findFirst({
      where: { name, tenantId }
    });

    return tag ? TagEntity.fromPrisma(tag) : null;
  }

  async findAll(tenantId: string): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    return tags.map(t => TagEntity.fromPrisma(t));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.tag.delete({
      where: { id }
    });
  }

  async findByIds(ids: string[], tenantId: string): Promise<TagEntity[]> {
    if (ids.length === 0) return [];

    const tags = await this.prisma.tag.findMany({
      where: { id: { in: ids }, tenantId }
    });

    return tags.map(t => TagEntity.fromPrisma(t));
  }
}
