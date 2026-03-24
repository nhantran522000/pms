/**
 * Health module page with weight chart
 *
 * Displays health overview with weight trends and time range selector
 * Per CONTEXT.md: "Health card: Latest weight, sleep quality badge, workout streak"
 */

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WeightChart } from '@/components/charts/WeightChart';
import { useWeightSummary } from '@/hooks/useHealthData';
import { TIME_RANGES, type TimeRangeValue } from '@/lib/chart-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function HealthPage() {
  const [days, setDays] = useState<TimeRangeValue>(30);
  const { data: weightData, isLoading } = useWeightSummary();

  // Mock chart data - in production, this would come from a trends endpoint
  const chartData = (() => {
    // For now, create mock data points
    const data = [];
    const today = new Date();
    const baseWeight = parseFloat(weightData?.latest || '150');

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add some variation to simulate real data
      const variation = (Math.random() - 0.5) * 2;
      data.push({
        date: date.toISOString().split('T')[0],
        weight: Math.round((baseWeight + variation) * 10) / 10,
      });
    }

    return data;
  })();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Health</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track your vitals, sleep, and workouts</p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Latest Weight</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-2" />
            ) : (
              <>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {weightData?.latest || '--'} {weightData?.unit || 'lbs'}
                </p>
                {weightData?.trend && (
                  <p className={`text-sm mt-1 ${
                    weightData.trend === 'improving' ? 'text-green-600' :
                    weightData.trend === 'declining' ? 'text-red-600' :
                    'text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {weightData.trend === 'improving' ? '↓' :
                     weightData.trend === 'declining' ? '↑' : '→'}{' '}
                    {Math.abs(weightData.changePercent || 0).toFixed(1)}%
                  </p>
                )}
              </>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Sleep Quality</p>
            <Skeleton className="h-8 w-32 mt-2" />
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Workout Streak</p>
            <Skeleton className="h-8 w-32 mt-2" />
          </Card>
        </div>

        {/* Chart Card */}
        <Card className="p-6">
          {/* Time range selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Weight Trend</h2>
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

          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 0 ? (
            <WeightChart data={chartData} days={days} unit={weightData?.unit as 'lbs' | 'kg' || 'lbs'} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              No weight data for this time range
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
