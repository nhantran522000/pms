/**
 * Hobbies module page with progress chart visualization
 *
 * Displays hobbies list with tracking-type-specific charts
 * Per CONTEXT.md: "Hobbies card: Active hobbies, completion rate, goal progress"
 */

'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { HobbyProgressChart } from '@/components/charts/HobbyProgressChart';
import { useHobbies, useHobbyTrends } from '@/hooks/useHobbiesData';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function HobbiesPage() {
  const [selectedHobbyId, setSelectedHobbyId] = useState<string | null>(null);
  const { data: hobbies, isLoading } = useHobbies(true);
  const { data: trendsData, isLoading: trendsLoading } = useHobbyTrends(
    selectedHobbyId || '',
    30
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Hobbies</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track personal projects and leisure activities</p>
        </div>

        {/* Hobbies List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-[200px] w-full" />
              </Card>
            ))}
          </div>
        ) : hobbies && hobbies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hobbies.map((hobby) => {
              const isSelected = selectedHobbyId === hobby.id;
              const showChart = isSelected && trendsData && trendsData.length > 0;

              return (
                <Card key={hobby.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {hobby.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {hobby.trackingType}
                        </span>
                      </div>
                      {hobby.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {hobby.description}
                        </p>
                      )}
                    </div>
                    {hobby.goalTarget && (
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {hobby.currentProgress || 0}
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">/{hobby.goalTarget}</span>
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">progress</p>
                      </div>
                    )}
                  </div>

                  {trendsLoading && isSelected ? (
                    <Skeleton className="h-[250px] w-full" />
                  ) : showChart ? (
                    <HobbyProgressChart
                      data={trendsData.map((t) => ({
                        date: t.date,
                        value: t.value,
                        cumulative: t.type === 'COUNTER' ? t.value : undefined,
                      }))}
                      trackingType={hobby.trackingType}
                      days={30}
                      goalTarget={hobby.goalTarget}
                    />
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <button
                        onClick={() => setSelectedHobbyId(hobby.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View progress chart →
                      </button>
                    </div>
                  )}

                  {isSelected && (
                    <button
                      onClick={() => setSelectedHobbyId(null)}
                      className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Close chart
                    </button>
                  )}

                  {/* Stats */}
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Logs</p>
                      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {hobby.totalLogs || 0}
                      </p>
                    </div>
                    {hobby.goalTarget && (
                      <div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Completion</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {Math.round(((hobby.currentProgress || 0) / hobby.goalTarget) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">No active hobbies. Start tracking your first hobby!</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
