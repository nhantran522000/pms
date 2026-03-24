/**
 * TanStack Query hooks for Tasks module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getTasks,
  getOverdueTasks,
} from '@/lib/api/tasks';

export function useTasks(filters?: {
  status?: 'pending' | 'completed' | 'overdue';
  priority?: number;
  tags?: string;
  rootOnly?: boolean;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['tasks', 'tasks', filters],
    queryFn: () => getTasks(filters),
  });
}

export function useOverdueTasks() {
  return useQuery({
    queryKey: ['tasks', 'tasks', 'overdue'],
    queryFn: () => getOverdueTasks(),
  });
}
