import { DashboardLayout } from '@/components/DashboardLayout';
import { ModuleCard } from '@/components/ModuleCard';
import { getModuleNavItems } from '@/lib/navigation';
import {
  DollarSign,
  CheckSquare2,
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

/**
 * Dashboard page with cross-module summary
 * Shows key metrics from all 6 modules in one view
 *
 * Per CONTEXT.md: "Home screen: Cross-module summary dashboard — Key metrics from all modules in one view"
 * Per CONTEXT.md: "Loading states: Skeleton screens"
 * Per CONTEXT.md: "Error handling: Toast notification + inline error message"
 */
export default function DashboardPage() {
  // Fetch real data from all modules using TanStack Query hooks
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useTotalBalance();
  const { data: habits, isLoading: habitsLoading, error: habitsError } = useHabitsForToday();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks({ status: 'pending', rootOnly: true });
  const { data: overdueTasks, isLoading: overdueLoading } = useOverdueTasks();
  const { data: healthDashboard, isLoading: healthLoading, error: healthError } = useHealthDashboard();
  const { data: notes, isLoading: notesLoading, error: notesError } = useNotes();
  const { data: hobbiesDashboard, isLoading: hobbiesLoading, error: hobbiesError } = useHobbyDashboard();

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
        trend: healthDashboard?.weight.trend ?? 'neutral',
        isLoading: healthLoading,
        error: healthError,
      },
      {
        label: 'Sleep',
        value: healthDashboard ? `${healthDashboard.sleep.avgHours}h` : '--',
        trend: healthDashboard?.sleep.trend ?? 'neutral',
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
    CheckSquare2,
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Welcome to PMS — your personal management system
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center text-zinc-600 dark:text-zinc-400">
          Loading dashboard data...
        </div>
      )}

      {/* Error State */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            Some data failed to load. Please refresh the page.
          </p>
        </div>
      )}

      {/* Module Cards Grid */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navItems.map((item) => {
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
        })}
      </div>
    </DashboardLayout>
  );
}
