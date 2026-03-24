/**
 * TanStack Query hooks for Notes module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getNotes,
  searchNotes,
} from '@/lib/api/notes';

export function useNotes(isJournal?: boolean) {
  return useQuery({
    queryKey: ['notes', 'notes', { isJournal }],
    queryFn: () => getNotes(isJournal),
  });
}

export function useNoteSearch(query: string) {
  return useQuery({
    queryKey: ['notes', 'search', query],
    queryFn: () => searchNotes(query),
    enabled: query.length > 0,
  });
}
