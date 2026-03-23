import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { JournalEntryRepository } from '../../infrastructure/repositories/journal-entry.repository';
import { JournalEntryEntity } from '../../domain/entities/journal-entry.entity';
import { Mood } from '../../domain/value-objects/mood.vo';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from '@pms/shared-types';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(private readonly journalRepository: JournalEntryRepository) {}

  async create(dto: CreateJournalEntryDto): Promise<JournalEntryEntity> {
    const tenantId = this.getTenantId();
    const entryDate = new Date(dto.entryDate);
    this.logger.log(`Creating journal entry for: ${dto.entryDate}`);

    // Check if entry already exists for this date
    const existing = await this.journalRepository.findByDate(entryDate, tenantId);
    if (existing) {
      throw new ConflictException('Journal entry already exists for this date');
    }

    const entry = await this.journalRepository.create({
      tenantId,
      entryDate,
      content: dto.content,
      mood: Mood.fromNumber(dto.mood),
    });

    this.logger.log(`Journal entry created: ${entry.id}`);
    return entry;
  }

  async findById(id: string): Promise<JournalEntryEntity> {
    const tenantId = this.getTenantId();
    const entry = await this.journalRepository.findById(id, tenantId);

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  async findByDate(date: string): Promise<JournalEntryEntity> {
    const tenantId = this.getTenantId();
    const entryDate = new Date(date);
    const entry = await this.journalRepository.findByDate(entryDate, tenantId);

    if (!entry) {
      throw new NotFoundException('Journal entry not found for this date');
    }

    return entry;
  }

  async findAll(options?: { startDate?: string; endDate?: string; limit?: number }): Promise<JournalEntryEntity[]> {
    const tenantId = this.getTenantId();
    return this.journalRepository.findAll(tenantId, {
      startDate: options?.startDate ? new Date(options.startDate) : undefined,
      endDate: options?.endDate ? new Date(options.endDate) : undefined,
      limit: options?.limit,
    });
  }

  async update(id: string, dto: UpdateJournalEntryDto): Promise<JournalEntryEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating journal entry: ${id}`);

    const existing = await this.journalRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Journal entry not found');
    }

    const entry = await this.journalRepository.update(id, tenantId, {
      content: dto.content,
      ...(dto.mood !== undefined && { mood: Mood.fromNumber(dto.mood) }),
    });

    this.logger.log(`Journal entry updated: ${id}`);
    return entry;
  }

  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting journal entry: ${id}`);

    const existing = await this.journalRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Journal entry not found');
    }

    await this.journalRepository.delete(id, tenantId);
    this.logger.log(`Journal entry deleted: ${id}`);
  }

  private getTenantId(): string {
    const tenantId = process.env.APP_TENANT_ID || '';
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
