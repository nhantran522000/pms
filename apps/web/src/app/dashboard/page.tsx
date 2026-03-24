'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ModuleCard } from '@/components/ModuleCard';
import { getModuleNavItems } from '@/lib/navigation';
import {
  DollarSign,
  CheckSquare,
  ListTodo,
  Heart,
  FileText,
  Trophy,
} from 'lucide-react';
import { useTotalBalance } from '@/hooks/useFinancialData';
import { useHabitsForToday } from '@/hooks/useHabitsData';
import { useTasks, useOverdueTasks } from '@/hooks/useTasksData';
import { useHealthDashboard } from '@/hooks/useHealthData';
import { useNotes } from '@/hooks/useNotesData';
import { useHobbyDashboard } from '@/hooks/useHobbiesData';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

/**
 * Dashboard page with cross-module summary
 * Shows key metrics from all 6 modules in one view
 *
 * Per CONTEXT.md: "Home screen: Cross-module summary dashboard — Key metrics from all modules in one view"
 * Per CONTEXT.md: "Loading states: Skeleton screens — Better perceived performance than spinners"
 * Per CONTEXT.md: "Error handling: Toast notification + inline error message"
 */

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();

  // Fetch real data from all modules using TanStack Query hooks
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useTotalBalance();
  const { data: habits, isLoading: habitsLoading, error: habitsError } = useHabitsForToday();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks({ status: 'pending', rootOnly: true });
  const { data: overdueTasks, isLoading: overdueLoading } = useOverdueTasks();
  const { data: healthDashboard, isLoading: healthLoading, error: healthError } = useHealthDashboard();
  const { data: notes, isLoading: notesLoading, error: notesError } = useNotes();
  const { data: hobbiesDashboard, isLoading: hobbiesLoading, error: hobbiesError } = useHobbyDashboard();

  // Show toast notifications for errors
  useEffect(() => {
    if (balanceError) {
      toast({
        title: 'Error loading financial data',
        description: balanceError instanceof Error ? balanceError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [balanceError, toast]);

  useEffect(() => {
    if (habitsError) {
      toast({
        title: 'Error loading habits data',
        description: habitsError instanceof Error ? habitsError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [habitsError, toast]);

  useEffect(() => {
    if (tasksError) {
      toast({
        title: 'Error loading tasks data',
        description: tasksError instanceof Error ? tasksError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [tasksError, toast]);

  useEffect(() => {
    if (healthError) {
      toast({
        title: 'Error loading health data',
        description: healthError instanceof Error ? healthError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [healthError, toast]);

  useEffect(() => {
    if (notesError) {
      toast({
        title: 'Error loading notes data',
        description: notesError instanceof Error ? notesError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [notesError, toast]);

  useEffect(() => {
    if (hobbiesError) {
      toast({
        title: 'Error loading hobbies data',
        description: hobbiesError instanceof Error ? hobbiesError.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [hobbiesError, toast]);

  // Calculate metrics from real data
  const moduleMetrics = {
    financial: [
      {
        label: 'Balance',
        value: balanceData ? `$${balanceData.totalBalance}` : '--',
        trend: 'neutral' as const,
        isLoading: balanceLoading,
        error: balanceError,
      },
      {
        label: 'Status',
        value: 'Active',
        trend: 'neutral' as const,
        isLoading: false,
      },
    ],
    habits: [
      {
        label: 'Today',
        value: habits
          ? `${habits.filter((h) => h.completedToday).length}/${habits.length}`
          : '--',
        trend: 'neutral' as const,
        isLoading: habitsLoading,
        error: habitsError,
      },
      {
        label: 'Streak',
        value: habits && habits.length > 0 ? `${Math.max(0, habits[0]?.currentStreak || 0)} days` : '--',
        trend: 'neutral' as const,
        isLoading: false,
      },
    ],
    tasks: [
      {
        label: 'Overdue',
        value: overdueTasks ? overdueTasks.length.toString() : '--',
        trend: (overdueTasks?.length || 0) > 0 ? ('negative' as const) : ('neutral' as const),
        isLoading: overdueLoading,
      },
      {
        label: 'Pending',
        value: tasks ? tasks.length.toString() : '--',
        trend: 'neutral' as const,
        isLoading: tasksLoading,
        error: tasksError,
      },
    ],
    health: [
      {
        label: 'Weight',
        value: healthDashboard ? `${healthDashboard.weight.latest} ${healthDashboard.weight.unit}` : '--',
        trend: (healthDashboard?.weight.trend ?? 'neutral') as 'improving' | 'stable' | 'declining' | 'up' | 'down' | 'neutral' | 'positive' | 'negative',
        isLoading: healthLoading,
        error: healthError,
      },
      {
        label: 'Sleep',
        value: healthDashboard ? `${healthDashboard.sleep.avgHours}h` : '--',
        trend: (healthDashboard?.sleep.trend ?? 'neutral') as 'improving' | 'stable' | 'declining' | 'up' | 'down' | 'neutral' | 'positive' | 'negative',
        isLoading: false,
      },
    ],
    notes: [
      {
        label: 'Recent',
        value: notes ? `${notes.length} notes` : '--',
        trend: 'neutral' as const,
        isLoading: notesLoading,
        error: notesError,
      },
      {
        label: 'Status',
        value: 'Active',
        trend: 'neutral' as const,
        isLoading: false,
      },
    ],
    hobbies: [
      {
        label: 'Active',
        value: hobbiesDashboard ? hobbiesDashboard.activeHobbies.toString() : '--',
        trend: 'neutral' as const,
        isLoading: hobbiesLoading,
        error: hobbiesError,
      },
      {
        label: 'Progress',
        value: hobbiesDashboard ? `${Math.round(hobbiesDashboard.avgCompletionRate)}%` : '--',
        trend: 'neutral' as const,
        isLoading: false,
      },
    ],
  };

  // Check if any data is loading
  const isLoading = balanceLoading || habitsLoading || tasksLoading || healthLoading || notesLoading || hobbiesLoading;

  // Collect all errors
  const errors = [balanceError, habitsError, tasksError, healthError, notesError, hobbiesError].filter(Boolean);

  const iconMap = {
    DollarSign,
    CheckSquare,
    ListTodo,
    Heart,
    FileText,
    Trophy,
  };

  const navItems = getModuleNavItems();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to PMS — your personal management system
        </p>
      </div>

      {/* Error State */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            Some data failed to load. Please refresh the page.
          </p>
        </div>
      )}

      {/* Module Cards Grid */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show 6 skeleton cards while loading
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          // Show actual cards when data is loaded
          navItems.map((item) => {
            const Icon = iconMap[item.icon.name as keyof typeof iconMap];
            const metricsKey = item.href.replace('/', '') as keyof typeof moduleMetrics;
            const metrics = moduleMetrics[metricsKey] || [];

            return (
              <ModuleCard
                key={item.name}
                name={item.name}
                description={item.description}
                href={item.href}
                icon={Icon}
                metrics={metrics}
              />
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
