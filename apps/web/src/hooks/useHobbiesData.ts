/**
 * TanStack Query hooks for Hobbies module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getHobbies,
  getHobbyTrends,
  getHobbyDashboard,
} from '@/lib/api/hobbies';

export function useHobbies(isActive?: boolean) {
  return useQuery({
    queryKey: ['hobbies', 'hobbies', { isActive }],
    queryFn: () => getHobbies(isActive),
  });
}

export function useHobbyTrends(hobbyId: string, days = 30) {
  return useQuery({
    queryKey: ['hobbies', 'trends', hobbyId, days],
    queryFn: () => getHobbyTrends(hobbyId, days),
    enabled: !!hobbyId,
  });
}

export function useHobbyDashboard() {
  return useQuery({
    queryKey: ['hobbies', 'dashboard'],
    queryFn: () => getHobbyDashboard(),
  });
}
