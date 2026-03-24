/**
 * HabitStreakChart component for displaying habit streak progression over time
 *
 * Per CONTEXT.md: "Habit calendar with completion history visualization" (simplified to line chart for v1)
 * Per CONTEXT.md: "Chart style: Minimal line/bar charts — Clean, data-focused, no 3D or gradients"
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatChartDate, CHART_COLORS, CHART_DIMENSIONS, type BaseChartProps } from '@/lib/chart-utils';

export interface HabitStreakDataPoint {
  date: string;
  streakLength: number;
}

export interface HabitStreakChartProps extends BaseChartProps<HabitStreakDataPoint> {
  showArea?: boolean;
}

/**
 * Custom tooltip for habit streak chart
 */
function HabitStreakTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload?: HabitStreakDataPoint }> }) {
  if (!active || !payload || !payload[0]) {
    return null;
  }

  const data = payload[0].payload;
  if (!data) return null;
  const streak = payload[0].value;

  return (
    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{formatChartDate(data.date, 'long')}</p>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {streak} {streak === 1 ? 'day' : 'days'} streak
      </p>
    </div>
  );
}

/**
 * HabitStreakChart component displays streak length over time
 * Per CONTEXT.md: "Chart style: Minimal line/bar charts"
 * Simplified from calendar view to line chart for v1
 */
export function HabitStreakChart({ data, days = 30, showArea = false, className = '' }: HabitStreakChartProps) {
  // Use AreaChart if showArea is true, otherwise LineChart
  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
        <ChartComponent data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatChartDate(date, 'short')}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <YAxis
            tickFormatter={(value) => Math.round(value).toString()}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <Tooltip content={<HabitStreakTooltip />} />
          {showArea ? (
            <>
              <Area
                type="monotone"
                dataKey="streakLength"
                stroke={CHART_COLORS.neutral}
                fill={CHART_COLORS.neutral}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="streakLength"
              stroke={CHART_COLORS.neutral}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLORS.neutral }}
              activeDot={{ r: 6, fill: CHART_COLORS.neutral }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
