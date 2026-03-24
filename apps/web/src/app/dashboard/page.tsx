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

/**
 * Dashboard page with cross-module summary
 * Shows key metrics from all 6 modules in one view
 *
 * Per CONTEXT.md: "Home screen: Cross-module summary dashboard — Key metrics from all modules in one view"
 *
 * Note: Real metrics will be connected in plan 09-03 (TanStack Query)
 * Currently using placeholder/dummy metrics for UI structure
 */
export default function DashboardPage() {
  // Placeholder metrics for each module
  // TODO: Replace with real data from API in plan 09-03
  const moduleMetrics = {
    financial: [
      { label: 'Balance', value: '$0.00', trend: 'neutral' as const },
      { label: 'Spending', value: '$0.00', trend: 'neutral' as const },
      { label: 'Budget', value: '0%', trend: 'neutral' as const },
    ],
    habits: [
      { label: 'Today', value: '0%', trend: 'neutral' as const },
      { label: 'Streak', value: '0 days', trend: 'neutral' as const },
    ],
    tasks: [
      { label: 'Overdue', value: '0', trend: 'neutral' as const },
      { label: 'Today', value: '0 tasks', trend: 'neutral' as const },
    ],
    health: [
      { label: 'Weight', value: '--', trend: 'neutral' as const },
      { label: 'Sleep', value: '--', trend: 'neutral' as const },
    ],
    notes: [
      { label: 'Recent', value: '0 notes', trend: 'neutral' as const },
      { label: 'Mood', value: 'stable', trend: 'neutral' as const },
    ],
    hobbies: [
      { label: 'Active', value: '0', trend: 'neutral' as const },
      { label: 'Progress', value: '0%', trend: 'neutral' as const },
    ],
  };

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
