import Link from 'next/link';
import { type LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral' | 'positive' | 'negative' | 'improving' | 'stable' | 'declining';
  isLoading?: boolean;
  error?: Error | unknown;
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
 * Uses shadcn/ui Card and Button components
 * Per CONTEXT.md: Module cards show key metrics per domain
 * Per CONTEXT.md: Zinc base (neutral grays), Indigo accent (primary)
 */
export function ModuleCard({ name, description, href, icon: Icon, metrics }: ModuleCardProps) {
  return (
    <Card className="group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 hover:shadow-md">
      <Link href={href} className="block h-full">
        <CardHeader>
          <div className="flex items-start space-x-3">
            <div className={cn(
              'p-2 rounded-lg',
              'bg-indigo-50 dark:bg-indigo-950',
              'group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900',
              'transition-colors'
            )}>
              <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="mt-0.5">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {metrics.slice(0, 4).map((metric, index) => (
              <div key={index} className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {metric.label}
                </p>
                <div className="flex items-center space-x-1">
                  {metric.isLoading ? (
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  ) : metric.error ? (
                    <p className="text-sm text-destructive">Error</p>
                  ) : (
                    <>
                      <p className="text-lg font-semibold">
                        {metric.value}
                      </p>
                      {metric.trend && (
                        <span className={cn(
                          'text-xs',
                          (metric.trend === 'up' || metric.trend === 'positive' || metric.trend === 'improving') && 'text-green-600 dark:text-green-400',
                          (metric.trend === 'down' || metric.trend === 'negative' || metric.trend === 'declining') && 'text-destructive',
                          (metric.trend === 'neutral' || metric.trend === 'stable') && 'text-muted-foreground'
                        )}>
                          {metric.trend === 'up' || metric.trend === 'positive' || metric.trend === 'improving' ? '↑' :
                           metric.trend === 'down' || metric.trend === 'negative' || metric.trend === 'declining' ? '↓' : '→'}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="ghost" size="sm" className="group/btn w-full justify-start px-0">
            <span className="text-indigo-600 dark:text-indigo-400 group-hover/btn:text-indigo-700 dark:group-hover/btn:text-indigo-300">
              View
            </span>
            <ChevronRight className="ml-1 h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
