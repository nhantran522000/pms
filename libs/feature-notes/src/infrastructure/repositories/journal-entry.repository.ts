import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { JournalEntryEntity } from '../../domain/entities/journal-entry.entity';
import { Mood } from '../../domain/value-objects/mood.vo';
import { Prisma } from '@prisma/client';

export interface CreateJournalEntryInput {
  tenantId: string;
  entryDate: Date;
  content: Record<string, unknown>;
  mood: Mood;
}

export interface UpdateJournalEntryInput {
  content?: Record<string, unknown>;
  mood?: Mood;
}

@Injectable()
export class JournalEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateJournalEntryInput): Promise<JournalEntryEntity> {
    const entry = await this.prisma.journalEntry.create({
      data: {
        tenantId: input.tenantId,
        entryDate: input.entryDate,
        content: input.content as Prisma.JsonValue,
        mood: input.mood.value,
      },
    });

    return JournalEntryEntity.fromPrisma(entry);
  }

  async findById(id: string, tenantId: string): Promise<JournalEntryEntity | null> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, tenantId },
    });

    return entry ? JournalEntryEntity.fromPrisma(entry) : null;
  }

  async findByDate(entryDate: Date, tenantId: string): Promise<JournalEntryEntity | null> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { entryDate, tenantId },
    });

    return entry ? JournalEntryEntity.fromPrisma(entry) : null;
  }

  async findAll(
    tenantId: string,
    options?: { startDate?: Date; endDate?: Date; limit?: number },
  ): Promise<JournalEntryEntity[]> {
    const where: Prisma.JournalEntryWhereInput = {
      tenantId,
      ...(options?.startDate && { entryDate: { gte: options.startDate } }),
      ...(options?.endDate && { entryDate: { lte: options.endDate } }),
    };

    const entries = await this.prisma.journalEntry.findMany({
      where,
      orderBy: { entryDate: 'desc' },
      take: options?.limit,
    });

    return entries.map((e) => JournalEntryEntity.fromPrisma(e));
  }

  async update(
    id: string,
    tenantId: string,
    input: UpdateJournalEntryInput,
  ): Promise<JournalEntryEntity> {
    const data: Prisma.JournalEntryUpdateInput = {};

    if (input.content !== undefined) {
      data.content = input.content as Prisma.JsonValue;
    }
    if (input.mood !== undefined) {
      data.mood = input.mood.value;
    }

    const entry = await this.prisma.journalEntry.update({
      where: { id },
      data,
    });

    return JournalEntryEntity.fromPrisma(entry);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.journalEntry.delete({
      where: { id },
    });
  }

  async getMoodTrends(
    tenantId: string,
    days: number,
  ): Promise<Array<{ date: Date; mood: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const entries = await this.prisma.journalEntry.findMany({
      where: {
        tenantId,
        entryDate: { gte: startDate },
      },
      orderBy: { entryDate: 'asc' },
      select: { entryDate: true, mood: true },
    });

    return entries.map((e) => ({
      date: e.entryDate,
      mood: e.mood,
    }));
  }
}
