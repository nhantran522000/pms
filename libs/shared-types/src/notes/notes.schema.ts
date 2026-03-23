import { z } from 'zod';

// Mood scale (1-5)
export const MoodSchema = z.number().int().min(1).max(5);
export type Mood = z.infer<typeof MoodSchema>;

// Create Note
export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.record(z.unknown()).optional().default({ type: 'doc', content: [] }), // Tiptap JSON
  folderId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).max(20).optional().default([]), // Max 20 tags per NOTE-05
});
export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;

// Update Note
export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.unknown()).optional(),
  folderId: z.string().cuid().nullable().optional(),
  tagIds: z.array(z.string().cuid()).max(20).optional(),
});
export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;

// Note response
export const NoteResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  title: z.string(),
  content: z.record(z.unknown()),
  folderId: z.string().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});
export type NoteResponse = z.infer<typeof NoteResponseSchema>;

// Create Folder
export const CreateFolderSchema = z.object({
  name: z.string().min(1).max(100),
});
export type CreateFolderDto = z.infer<typeof CreateFolderSchema>;

// Update Folder
export const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});
export type UpdateFolderDto = z.infer<typeof UpdateFolderSchema>;

// Folder response
export const FolderResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  noteCount: z.number().optional(),
  createdAt: z.date(),
});
export type FolderResponse = z.infer<typeof FolderResponseSchema>;

// Create Tag
export const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
});
export type CreateTagDto = z.infer<typeof CreateTagSchema>;

// Tag response
export const TagResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  createdAt: z.date(),
});
export type TagResponse = z.infer<typeof TagResponseSchema>;

// Create Journal Entry
export const CreateJournalEntrySchema = z.object({
  entryDate: z.string().date(), // YYYY-MM-DD format
  content: z.record(z.unknown()).optional().default({ type: 'doc', content: [] }),
  mood: MoodSchema,
});
export type CreateJournalEntryDto = z.infer<typeof CreateJournalEntrySchema>;

// Update Journal Entry
export const UpdateJournalEntrySchema = z.object({
  content: z.record(z.unknown()).optional(),
  mood: MoodSchema.optional(),
});
export type UpdateJournalEntryDto = z.infer<typeof UpdateJournalEntrySchema>;

// Journal Entry response
export const JournalEntryResponseSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  entryDate: z.date(),
  content: z.record(z.unknown()),
  mood: MoodSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type JournalEntryResponse = z.infer<typeof JournalEntryResponseSchema>;

// Search query
export const SearchNotesSchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
export type SearchNotesDto = z.infer<typeof SearchNotesSchema>;

// Search results response
export const SearchResultsSchema = z.object({
  notes: z.array(NoteResponseSchema),
  total: z.number(),
  query: z.string(),
});
export type SearchResults = z.infer<typeof SearchResultsSchema>;

// Mood trends response
export const MoodTrendsSchema = z.object({
  entries: z.array(z.object({
    date: z.string(),
    mood: MoodSchema,
  })),
  averageMood: z.number(),
  trend: z.enum(['improving', 'stable', 'declining']),
});
export type MoodTrends = z.infer<typeof MoodTrendsSchema>;

// Mood query params
export const MoodTrendsQuerySchema = z.object({
  days: z.coerce.number().int().min(7).max(365).optional().default(30),
});
export type MoodTrendsQuery = z.infer<typeof MoodTrendsQuerySchema>;
