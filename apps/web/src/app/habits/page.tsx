/**
 * Habits module page with habit streak visualization
 *
 * Displays habits list with streak charts
 * Per CONTEXT.md: "Habits card: Today's completion rate, current streak, upcoming habits"
 */

'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { HabitStreakChart } from '@/components/charts/HabitStreakChart';
import { useHabits } from '@/hooks/useHabitsData';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function HabitsPage() {
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const { data: habits, isLoading } = useHabits(true);

  // Mock streak data - in production, this would come from completions endpoint
  const getMockStreakData = (habitId: string) => {
    const data = [];
    const days = 30;
    const today = new Date();

    // Generate random streak pattern
    let currentStreak = Math.floor(Math.random() * 15);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Randomly break streak occasionally
      if (Math.random() > 0.8 && currentStreak > 0) {
        currentStreak = 0;
      }

      // Increment streak some days
      if (Math.random() > 0.3) {
        currentStreak += 1;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        streakLength: currentStreak,
      });
    }

    return data;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Habits</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track daily habits and build consistency</p>
        </div>

        {/* Habits List */}
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
        ) : habits && habits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {habits.map((habit) => {
              const streakData = selectedHabitId === habit.id ? getMockStreakData(habit.id) : [];
              const mockStreak = Math.floor(Math.random() * 20);

              return (
                <Card key={habit.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {habit.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{mockStreak}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">day streak</p>
                    </div>
                  </div>

                  {selectedHabitId === habit.id ? (
                    <HabitStreakChart data={streakData} days={30} showArea />
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <button
                        onClick={() => setSelectedHabitId(habit.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View streak chart →
                      </button>
                    </div>
                  )}

                  {selectedHabitId === habit.id && (
                    <button
                      onClick={() => setSelectedHabitId(null)}
                      className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Close chart
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">No active habits. Create your first habit to get started!</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
