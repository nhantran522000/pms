/**
 * Habits API client functions
 *
 * Backend endpoints from feature-habits module:
 * - GET /api/v1/habits/habits
 * - GET /api/v1/habits/habits/today
 * - POST /api/v1/habits/habits/:id/check-in
 * - GET /api/v1/habits/habits/:id/completions
 * - GET /api/v1/habits/habits/:id/streak
 */

import { get, post, put, del } from '../api';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[];
  completedToday?: boolean;
  completionId?: string;
  isActive: boolean;
  currentStreak?: number;
  bestStreak?: number;
  totalCompletions?: number;
}

export interface HabitCheckIn {
  id: string;
  habitId: string;
  date: string;
  notes?: string;
}

export interface CreateCheckInDto {
  date?: string;
  notes?: string;
}

export interface HabitStreak {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompletionDate?: string;
}

export async function getHabits(isActive?: boolean): Promise<Habit[]> {
  const response = await get<{ success: true; data: Habit[] }>(
    `/habits/habits${isActive !== undefined ? `?isActive=${isActive}` : ''}`
  );
  return response.data;
}

export async function getHabitsForToday(): Promise<Habit[]> {
  const response = await get<{ success: true; data: Habit[] }>(
    '/habits/habits/today'
  );
  return response.data;
}

export async function createCheckIn(habitId: string, dto: CreateCheckInDto): Promise<HabitCheckIn> {
  const response = await post<{ success: true; data: HabitCheckIn }>(
    `/habits/habits/${habitId}/check-in`,
    dto
  );
  return response.data;
}

export async function getHabitCompletions(
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitCheckIn[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const queryString = params.toString();
  const response = await get<{ success: true; data: HabitCheckIn[] }>(
    `/habits/habits/${habitId}/completions${queryString ? `?${queryString}` : ''}`
  );
  return response.data;
}

export async function getHabitStreak(habitId: string): Promise<HabitStreak> {
  const response = await get<{ success: true; data: HabitStreak }>(
    `/habits/habits/${habitId}/streak`
  );
  return response.data;
}
