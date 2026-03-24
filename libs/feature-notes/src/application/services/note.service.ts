import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NoteRepository } from '../../infrastructure/repositories/note.repository';
import { NoteEntity } from '../../domain/entities/note.entity';
import { CreateNoteDto, UpdateNoteDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(private readonly noteRepository: NoteRepository) {}

  async create(dto: CreateNoteDto): Promise<NoteEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating note: ${dto.title}`);

    const note = await this.noteRepository.create({
      tenantId,
      title: dto.title,
      content: dto.content,
      folderId: dto.folderId,
    }, dto.tagIds);

    this.logger.log(`Note created: ${note.id}`);
    return note;
  }

  async findById(id: string): Promise<NoteEntity> {
    const tenantId = this.getTenantId();
    const note = await this.noteRepository.findById(id, tenantId);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async findAll(folderId?: string): Promise<NoteEntity[]> {
    const tenantId = this.getTenantId();
    return this.noteRepository.findAll(tenantId, folderId);
  }

  async update(id: string, dto: UpdateNoteDto): Promise<NoteEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating note: ${id}`);

    const existing = await this.noteRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Note not found');
    }

    const note = await this.noteRepository.update(id, tenantId, {
      title: dto.title,
      content: dto.content,
      folderId: dto.folderId,
    }, dto.tagIds);

    this.logger.log(`Note updated: ${id}`);
    return note;
  }

  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Soft deleting note: ${id}`);

    const existing = await this.noteRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.softDelete(id, tenantId);
    this.logger.log(`Note soft deleted: ${id}`);
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
