/**
 * Financial API client functions
 *
 * Backend endpoints from feature-financial module:
 * - GET /api/v1/financial/accounts
 * - GET /api/v1/financial/accounts/summaries
 * - GET /api/v1/financial/accounts/total-balance
 * - GET /api/v1/financial/transactions
 * - GET /api/v1/financial/categories
 * - GET /api/v1/financial/categories/tree
 * - GET /api/v1/financial/budgets
 */

import { get, post, put, del } from '../api';

// Type definitions (simplified - can be enhanced with shared-types)
export interface Account {
  id: string;
  name: string;
  type: string;
  currentBalance: string;
  currency: string;
  isArchived: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId?: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
  payee?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  parentId?: string;
  children?: Category[];
}

export interface Budget {
  id: string;
  categoryId: string;
  category?: Category;
  allocated: string;
  spent: string;
  remaining: string;
  available: string;
  isOverBudget: boolean;
  month: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  limit?: number;
  offset?: number;
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId?: string;
  amount: string;
  type: 'income' | 'expense';
  date: string;
  payee?: string;
  description?: string;
}

// Account endpoints
export async function getAccounts(includeArchived = false): Promise<Account[]> {
  const response = await get<{ success: true; data: Account[] }>(
    `/financial/accounts?includeArchived=${includeArchived}`
  );
  return response.data;
}

export async function getAccountSummaries(includeArchived = false): Promise<Account[]> {
  const response = await get<{ success: true; data: Account[] }>(
    `/financial/accounts/summaries?includeArchived=${includeArchived}`
  );
  return response.data;
}

export async function getTotalBalance(): Promise<{ totalBalance: string; currency: string }> {
  const response = await get<{ success: true; data: { totalBalance: string; currency: string } }>(
    '/financial/accounts/total-balance'
  );
  return response.data;
}

// Transaction endpoints
export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.accountId) params.append('accountId', filters.accountId);
  if (filters?.categoryId) params.append('categoryId', filters.categoryId);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset !== undefined) params.append('offset', filters.offset.toString());

  const queryString = params.toString();
  const response = await get<{ success: true; data: Transaction[] }>(
    `/financial/transactions${queryString ? `?${queryString}` : ''}`
  );
  return response.data;
}

export async function createTransaction(data: CreateTransactionDto): Promise<Transaction> {
  const response = await post<{ success: true; data: Transaction }>(
    '/financial/transactions',
    data
  );
  return response.data;
}

// Category endpoints
export async function getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
  const response = await get<{ success: true; data: Category[] }>(
    `/financial/categories${type ? `?type=${type}` : ''}`
  );
  return response.data;
}

export async function getCategoryTree(): Promise<Category[]> {
  const response = await get<{ success: true; data: Category[] }>(
    '/financial/categories/tree'
  );
  return response.data;
}

// Budget endpoints
export async function getBudgets(month?: string): Promise<Budget[]> {
  const response = await get<{ success: true; data: Budget[] }>(
    `/financial/budgets/monthly?month=${month || new Date().toISOString().slice(0, 7)}`
  );
  return response.data;
}
