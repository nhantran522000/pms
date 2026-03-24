import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ModuleCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  metrics: Metric[];
}

/**
 * ModuleCard component for dashboard summaries
 * Displays key metrics for each module with link to full view
 *
 * Per CONTEXT.md: Module cards show key metrics per domain
 */
export function ModuleCard({ name, description, href, icon: Icon, metrics }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group block bg-white dark:bg-zinc-900',
        'border border-zinc-200 dark:border-zinc-800',
        'hover:border-indigo-300 dark:hover:border-indigo-700',
        'rounded-lg shadow-sm hover:shadow-md',
        'transition-all duration-200'
      )}
    >
      <div className="p-5">
        {/* Header: Icon + Name + Description */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-lg',
              'bg-indigo-50 dark:bg-indigo-950',
              'group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900',
              'transition-colors'
            )}>
              <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.slice(0, 4).map((metric, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">
                {metric.label}
              </p>
              <div className="flex items-center space-x-1">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {metric.value}
                </p>
                {metric.trend && (
                  <span className={cn(
                    'text-xs',
                    metric.trend === 'up' && 'text-green-600 dark:text-green-400',
                    metric.trend === 'down' && 'text-red-600 dark:text-red-400',
                    metric.trend === 'neutral' && 'text-zinc-500 dark:text-zinc-500'
                  )}>
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Link Button */}
        <div className={cn(
          'flex items-center text-sm font-medium',
          'text-indigo-600 dark:text-indigo-400',
          'group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
          'transition-colors'
        )}>
          <span>View</span>
          <svg className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
