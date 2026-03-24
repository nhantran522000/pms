/**
 * Hobbies API client functions
 *
 * Backend endpoints from feature-hobbies module:
 * - GET /api/v1/hobbies/hobbies
 * - GET /api/v1/hobbies/hobbies/:id/trends
 * - POST /api/v1/hobbies/hobbies/:id/logs
 * - GET /api/v1/hobbies/dashboard
 */

import { get, post } from '../api';

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  trackingType: 'COUNTER' | 'PERCENTAGE' | 'LIST';
  goalTarget?: number;
  goalDeadline?: string;
  isActive: boolean;
  currentProgress?: number;
  totalLogs?: number;
}

export interface HobbyTrend {
  date: string;
  value: number;
  type: 'COUNTER' | 'PERCENTAGE' | 'LIST';
}

export interface LogProgressDto {
  logValue: number | string;
  loggedAt?: string;
  notes?: string;
}

export interface HobbyLog {
  id: string;
  hobbyId: string;
  logValue: number | string;
  trackingType: 'COUNTER' | 'PERCENTAGE' | 'LIST';
  loggedAt: string;
  notes?: string;
  createdAt: string;
}

export interface HobbyDashboard {
  totalHobbies: number;
  activeHobbies: number;
  totalLogs: number;
  avgCompletionRate: number;
  recentActivity: HobbyLog[];
}

export async function getHobbies(isActive?: boolean): Promise<Hobby[]> {
  const response = await get<{ success: true; data: Hobby[] }>(
    `/hobbies/hobbies${isActive !== undefined ? `?isActive=${isActive}` : ''}`
  );
  return response.data;
}

export async function getHobbyTrends(
  hobbyId: string,
  days = 30
): Promise<HobbyTrend[]> {
  const response = await get<{ success: true; data: HobbyTrend[] }>(
    `/hobbies/hobbies/${hobbyId}/trends?days=${days}`
  );
  return response.data;
}

export async function logHobbyProgress(
  hobbyId: string,
  data: LogProgressDto
): Promise<HobbyLog> {
  const response = await post<{ success: true; data: HobbyLog }>(
    `/hobbies/hobbies/${hobbyId}/logs`,
    data
  );
  return response.data;
}

export async function getHobbyDashboard(): Promise<HobbyDashboard> {
  const response = await get<{ success: true; data: HobbyDashboard }>(
    '/hobbies/dashboard'
  );
  return response.data;
}
