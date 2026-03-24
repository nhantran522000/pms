/**
 * TanStack Query hooks for Financial module
 */

import { useQuery } from '@tanstack/react-query';
import {
  getAccounts,
  getAccountSummaries,
  getTotalBalance,
  getTransactions,
  getCategories,
  getCategoryTree,
  getBudgets,
} from '@/lib/api/financial';

export function useAccounts(includeArchived = false) {
  return useQuery({
    queryKey: ['financial', 'accounts', { includeArchived }],
    queryFn: () => getAccounts(includeArchived),
  });
}

export function useAccountSummaries(includeArchived = false) {
  return useQuery({
    queryKey: ['financial', 'accounts', 'summaries', { includeArchived }],
    queryFn: () => getAccountSummaries(includeArchived),
  });
}

export function useTotalBalance() {
  return useQuery({
    queryKey: ['financial', 'accounts', 'totalBalance'],
    queryFn: () => getTotalBalance(),
  });
}

export function useTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['financial', 'transactions', filters],
    queryFn: () => getTransactions(filters),
  });
}

export function useCategories(type?: 'income' | 'expense') {
  return useQuery({
    queryKey: ['financial', 'categories', { type }],
    queryFn: () => getCategories(type),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['financial', 'categories', 'tree'],
    queryFn: () => getCategoryTree(),
  });
}

export function useBudgets(month?: string) {
  return useQuery({
    queryKey: ['financial', 'budgets', 'monthly', month],
    queryFn: () => getBudgets(month),
  });
}
