/**
 * TanStack Query hooks for Habits module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getHabits,
  getHabitsForToday,
  getHabitCompletions,
  getHabitStreak,
} from '@/lib/api/habits';

export function useHabits(isActive?: boolean) {
  return useQuery({
    queryKey: ['habits', 'habits', { isActive }],
    queryFn: () => getHabits(isActive),
  });
}

export function useHabitsForToday() {
  return useQuery({
    queryKey: ['habits', 'habits', 'today'],
    queryFn: () => getHabitsForToday(),
  });
}

export function useHabitCompletions(
  habitId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ['habits', 'completions', habitId, { startDate, endDate }],
    queryFn: () => getHabitCompletions(habitId, startDate, endDate),
    enabled: !!habitId,
  });
}

export function useHabitStreak(habitId: string) {
  return useQuery({
    queryKey: ['habits', 'streak', habitId],
    queryFn: () => getHabitStreak(habitId),
    enabled: !!habitId,
  });
}
