import { JournalEntry } from '@prisma/client';
import { Mood } from '../value-objects/mood.vo';

export class JournalEntryEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly entryDate: Date,
    public readonly content: Record<string, unknown>,
    public readonly mood: Mood,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(entry: JournalEntry): JournalEntryEntity {
    return new JournalEntryEntity(
      entry.id,
      entry.tenantId,
      entry.entryDate,
      entry.content as Record<string, unknown>,
      Mood.fromNumber(entry.mood),
      entry.createdAt,
      entry.updatedAt,
    );
  }

  updateMood(mood: Mood): JournalEntryEntity {
    return new JournalEntryEntity(
      this.id,
      this.tenantId,
      this.entryDate,
      this.content,
      mood,
      this.createdAt,
      new Date(),
    );
  }

  updateContent(content: Record<string, unknown>): JournalEntryEntity {
    return new JournalEntryEntity(
      this.id,
      this.tenantId,
      this.entryDate,
      content,
      this.mood,
      this.createdAt,
      new Date(),
    );
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      entryDate: this.entryDate.toISOString().split('T')[0], // YYYY-MM-DD format
      content: this.content,
      mood: this.mood.value,
      moodLabel: this.mood.label,
      moodEmoji: this.mood.emoji,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
