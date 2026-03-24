/**
 * Health API client functions
 *
 * Backend endpoints from feature-health module:
 * - GET /api/v1/health/dashboard
 * - GET /api/v1/health/dashboard/weight
 * - GET /api/v1/health/dashboard/vitals
 * - GET /api/v1/health/dashboard/sleep
 * - GET /api/v1/health/dashboard/workouts
 */

import { get } from '../api';

export interface HealthDashboard {
  weight: {
    latest: string;
    unit: string;
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
    loggedAt: string | null;
  };
  vitals: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
      loggedAt: string | null;
    };
    heartRate: {
      bpm: number;
      loggedAt: string | null;
    };
  };
  sleep: {
    avgHours: number;
    avgQuality: number;
    trend: 'improving' | 'stable' | 'declining';
    recentQuality: number[];
  };
  workouts: {
    totalWorkouts: number;
    totalMinutes: number;
    avgDuration: number;
    recentCount: number[];
  };
  generatedAt: string;
}

export interface WeightPoint {
  date: string;
  weight: string;
  unit: string;
}

export interface HealthLog {
  id: string;
  type: string;
  data: Record<string, unknown>;
  loggedAt: string;
  createdAt: string;
}

export async function getHealthDashboard(): Promise<HealthDashboard> {
  const response = await get<{ success: true; data: HealthDashboard }>(
    '/health/dashboard'
  );
  return response.data;
}

export async function getWeightSummary(): Promise<{
  latest: string;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  loggedAt: string | null;
}> {
  const response = await get<{ success: true; data: { latest: string; unit: string; trend: 'improving' | 'stable' | 'declining'; changePercent: number; loggedAt: string | null } }>(
    '/health/dashboard/weight'
  );
  return response.data;
}

export async function getVitalsSummary(): Promise<{
  bloodPressure: { systolic: number; diastolic: number; loggedAt: string | null };
  heartRate: { bpm: number; loggedAt: string | null };
}> {
  const response = await get<{ success: true; data: { bloodPressure: { systolic: number; diastolic: number; loggedAt: string | null }; heartRate: { bpm: number; loggedAt: string | null } } }>(
    '/health/dashboard/vitals'
  );
  return response.data;
}

export async function getSleepSummary(): Promise<{
  avgHours: number;
  avgQuality: number;
  trend: 'improving' | 'stable' | 'declining';
  recentQuality: number[];
}> {
  const response = await get<{ success: true; data: { avgHours: number; avgQuality: number; trend: 'improving' | 'stable' | 'declining'; recentQuality: number[] } }>(
    '/health/dashboard/sleep'
  );
  return response.data;
}

export async function getWorkoutSummary(): Promise<{
  totalWorkouts: number;
  totalMinutes: number;
  avgDuration: number;
  recentCount: number[];
}> {
  const response = await get<{ success: true; data: { totalWorkouts: number; totalMinutes: number; avgDuration: number; recentCount: number[] } }>(
    '/health/dashboard/workouts'
  );
  return response.data;
}
