import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { TagRepository } from '../../infrastructure/repositories/tag.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { CreateTagDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(private readonly tagRepository: TagRepository) {}

  async create(dto: CreateTagDto): Promise<TagEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating tag: ${dto.name}`);

    // Check if tag already exists
    const existing = await this.tagRepository.findByName(dto.name, tenantId);
    if (existing) {
      throw new ConflictException('Tag with this name already exists');
    }

    const tag = await this.tagRepository.create({
      tenantId,
      name: dto.name,
    });

    this.logger.log(`Tag created: ${tag.id}`);
    return tag;
  }

  async findById(id: string): Promise<TagEntity> {
    const tenantId = this.getTenantId();
    const tag = await this.tagRepository.findById(id, tenantId);

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async findAll(): Promise<TagEntity[]> {
    const tenantId = this.getTenantId();
    return this.tagRepository.findAll(tenantId);
  }

  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting tag: ${id}`);

    const existing = await this.tagRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.delete(id, tenantId);
    this.logger.log(`Tag deleted: ${id}`);
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
