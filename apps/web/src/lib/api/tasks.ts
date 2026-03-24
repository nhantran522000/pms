/**
 * Tasks API client functions
 *
 * Backend endpoints from feature-tasks module:
 * - GET /api/v1/tasks/tasks
 * - GET /api/v1/tasks/tasks/overdue
 * - POST /api/v1/tasks/tasks
 * - PUT /api/v1/tasks/tasks/:id
 * - POST /api/v1/tasks/tasks/:id/complete
 */

import { get, post, put, del } from '../api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 1 | 2 | 3 | 4;
  dueDate?: string;
  tags: string[];
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: 'pending' | 'completed' | 'overdue';
  priority?: number;
  tags?: string;
  rootOnly?: boolean;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 1 | 2 | 3 | 4;
  tags?: string[];
  parentId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 1 | 2 | 3 | 4;
  tags?: string[];
  status?: 'pending' | 'completed';
}

export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority.toString());
  if (filters?.tags) params.append('tags', filters.tags);
  if (filters?.rootOnly) params.append('rootOnly', 'true');
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const queryString = params.toString();
  const response = await get<{ success: true; data: Task[] }>(
    `/tasks/tasks${queryString ? `?${queryString}` : ''}`
  );
  return response.data;
}

export async function getOverdueTasks(): Promise<Task[]> {
  const response = await get<{ success: true; data: Task[] }>(
    '/tasks/tasks/overdue'
  );
  return response.data;
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
  const response = await post<{ success: true; data: Task }>(
    '/tasks/tasks',
    data
  );
  return response.data;
}

export async function updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
  const response = await put<{ success: true; data: Task }>(
    `/tasks/tasks/${id}`,
    data
  );
  return response.data;
}

export async function markTaskComplete(id: string, completed = true): Promise<Task> {
  const response = await post<{ success: true; data: Task }>(
    `/tasks/tasks/${id}/complete`,
    { completed }
  );
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await del(`/tasks/tasks/${id}`);
}
