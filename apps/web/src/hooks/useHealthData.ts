/**
 * TanStack Query hooks for Health module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getHealthDashboard,
  getWeightSummary,
  getVitalsSummary,
  getSleepSummary,
  getWorkoutSummary,
} from '@/lib/api/health';

export function useHealthDashboard() {
  return useQuery({
    queryKey: ['health', 'dashboard'],
    queryFn: () => getHealthDashboard(),
  });
}

export function useWeightSummary() {
  return useQuery({
    queryKey: ['health', 'dashboard', 'weight'],
    queryFn: () => getWeightSummary(),
  });
}

export function useVitalsSummary() {
  return useQuery({
    queryKey: ['health', 'dashboard', 'vitals'],
    queryFn: () => getVitalsSummary(),
  });
}

export function useSleepSummary() {
  return useQuery({
    queryKey: ['health', 'dashboard', 'sleep'],
    queryFn: () => getSleepSummary(),
  });
}

export function useWorkoutSummary() {
  return useQuery({
    queryKey: ['health', 'dashboard', 'workouts'],
    queryFn: () => getWorkoutSummary(),
  });
}
