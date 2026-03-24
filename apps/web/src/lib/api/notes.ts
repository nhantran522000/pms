/**
 * Notes API client functions
 *
 * Backend endpoints from feature-notes module:
 * - GET /api/v1/notes/notes
 * - POST /api/v1/notes/notes
 * - GET /api/v1/notes/search
 */

import { get, post } from '../api';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  mood?: number;
  isJournal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  folderId?: string;
  tags?: string[];
  mood?: number;
  isJournal?: boolean;
}

export async function getNotes(isJournal?: boolean): Promise<Note[]> {
  const response = await get<{ success: true; data: Note[] }>(
    `/notes/notes${isJournal !== undefined ? `?isJournal=${isJournal}` : ''}`
  );
  return response.data;
}

export async function createNote(data: CreateNoteDto): Promise<Note> {
  const response = await post<{ success: true; data: Note }>(
    '/notes/notes',
    data
  );
  return response.data;
}

export async function searchNotes(query: string): Promise<Note[]> {
  const response = await get<{ success: true; data: Note[] }>(
    `/notes/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}
