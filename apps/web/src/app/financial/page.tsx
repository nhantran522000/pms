/**
 * Financial module page with spending chart
 *
 * Displays financial overview with charts and time range selector
 * Per CONTEXT.md: "Financial card: Account balance, monthly spending, budget progress bar"
 */

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { FinancialChart } from '@/components/charts/FinancialChart';
import { useTotalBalance, useTransactions } from '@/hooks/useFinancialData';
import { TIME_RANGES, type TimeRangeValue } from '@/lib/chart-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function FinancialPage() {
  const [days, setDays] = useState<TimeRangeValue>(30);
  const { data: balance, isLoading: balanceLoading } = useTotalBalance();

  // Calculate date range for transactions
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({
    startDate,
    endDate,
  });

  // Aggregate transactions by date for chart
  const chartData = (() => {
    if (!transactions) return [];

    const byDate = new Map<string, { income: number; expense: number }>();

    transactions.forEach((tx) => {
      const date = tx.date.split('T')[0];
      const current = byDate.get(date) ?? { income: 0, expense: 0 };

      if (tx.type === 'income') {
        current.income += parseFloat(tx.amount);
      } else {
        current.expense += parseFloat(tx.amount);
      }

      byDate.set(date, current);
    });

    return Array.from(byDate.entries())
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => a.date.localeCompare(b.date));
  })();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Financial</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track your income, expenses, and budgets</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Balance</p>
            {balanceLoading ? (
              <Skeleton className="h-8 w-32 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: balance?.currency || 'USD',
                }).format(parseFloat(balance?.totalBalance || '0'))}
              </p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Monthly Spending</p>
            {transactionsLoading ? (
              <Skeleton className="h-8 w-32 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(
                  chartData.reduce((sum, d) => sum + (d.expense || 0), 0)
                )}
              </p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Monthly Income</p>
            {transactionsLoading ? (
              <Skeleton className="h-8 w-32 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(
                  chartData.reduce((sum, d) => sum + (d.income || 0), 0)
                )}
              </p>
            )}
          </Card>
        </div>

        {/* Chart Card */}
        <Card className="p-6">
          {/* Time range selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Income vs Expenses</h2>
            <div className="flex gap-2">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.value}
                  variant={days === range.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDays(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {transactionsLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 0 ? (
            <FinancialChart data={chartData} days={days} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              No transaction data for this time range
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
