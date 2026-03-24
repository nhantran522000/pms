import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { FolderRepository } from '../../infrastructure/repositories/folder.repository';
import { FolderEntity } from '../../domain/entities/folder.entity';
import { CreateFolderDto, UpdateFolderDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class FolderService {
  private readonly logger = new Logger(FolderService.name);

  constructor(private readonly folderRepository: FolderRepository) {}

  async create(dto: CreateFolderDto): Promise<FolderEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating folder: ${dto.name}`);

    try {
      const folder = await this.folderRepository.create({
        tenantId,
        name: dto.name,
      });

      this.logger.log(`Folder created: ${folder.id}`);
      return folder;
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Folder with this name already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<FolderEntity> {
    const tenantId = this.getTenantId();
    const folder = await this.folderRepository.findById(id, tenantId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return folder;
  }

  async findAll(): Promise<FolderEntity[]> {
    const tenantId = this.getTenantId();
    return this.folderRepository.findAll(tenantId);
  }

  async update(id: string, dto: UpdateFolderDto): Promise<FolderEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating folder: ${id}`);

    const existing = await this.folderRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Folder not found');
    }

    try {
      const folder = await this.folderRepository.update(id, tenantId, dto.name!);
      this.logger.log(`Folder updated: ${id}`);
      return folder;
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Folder with this name already exists');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting folder: ${id}`);

    const existing = await this.folderRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Folder not found');
    }

    await this.folderRepository.delete(id, tenantId);
    this.logger.log(`Folder deleted: ${id}`);
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }

  private isUniqueConstraintError(error: unknown): boolean {
    const prismaError = error as { code?: string };
    return prismaError?.code === 'P2002';
  }
}
