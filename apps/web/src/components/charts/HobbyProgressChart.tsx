/**
 * HobbyProgressChart component for displaying hobby progress with tracking-type support
 *
 * Per CONTEXT.md: "Counter charts include both bars (daily increments) and line (running total)"
 * Supports COUNTER, PERCENTAGE, and LIST tracking types
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatChartDate, formatChartPercentage, CHART_COLORS, CHART_DIMENSIONS, type BaseChartProps } from '@/lib/chart-utils.ts';

export type HobbyTrackingType = 'COUNTER' | 'PERCENTAGE' | 'LIST';

export interface HobbyProgressDataPoint {
  date: string;
  value: number;
  cumulative?: number;
}

export interface HobbyProgressChartProps extends BaseChartProps<HobbyProgressDataPoint> {
  trackingType: HobbyTrackingType;
  goalTarget?: number;
}

/**
 * Custom tooltip for hobby progress chart
 */
function HobbyProgressTooltip({
  active,
  payload,
  trackingType,
  goalTarget,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  trackingType: HobbyTrackingType;
  goalTarget?: number;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const date = payload[0].payload?.date as string;

  const getLabel = (name: string) => {
    switch (name) {
      case 'value':
        return trackingType === 'COUNTER' ? 'Daily' : trackingType === 'PERCENTAGE' ? 'Progress' : 'Items';
      case 'cumulative':
        return 'Total';
      default:
        return name;
    }
  };

  const formatValue = (value: number, name: string) => {
    if (trackingType === 'PERCENTAGE') {
      return formatChartPercentage(Math.min(value, 100));
    }
    if (trackingType === 'LIST') {
      return `${value} item${value !== 1 ? 's' : ''}`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">{formatChartDate(date, 'long')}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
          {getLabel(entry.name)}: {formatValue(entry.value, entry.name)}
        </p>
      ))}
      {trackingType === 'PERCENTAGE' && goalTarget && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Goal: {formatChartPercentage(goalTarget)}
        </p>
      )}
    </div>
  );
}

/**
 * HobbyProgressChart component adapts to tracking type
 * Per CONTEXT.md: "Counter charts include both bars (daily increments) and line (running total)"
 */
export function HobbyProgressChart({ data, trackingType, days = 30, goalTarget, className = '' }: HobbyProgressChartProps) {
  const getYAxisLabel = () => {
    switch (trackingType) {
      case 'COUNTER':
        return 'Count';
      case 'PERCENTAGE':
        return '%';
      case 'LIST':
        return 'Items';
      default:
        return '';
    }
  };

  const tickFormatter = (value: number) => {
    if (trackingType === 'PERCENTAGE') {
      return `${value}%`;
    }
    return value.toString();
  };

  // COUNTER: ComposedChart with bars + line
  if (trackingType === 'COUNTER') {
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => formatChartDate(date, 'short')}
              stroke="#71717a"
              className="text-xs"
              tick={{ fill: '#71717a' }}
            />
            <YAxis
              tickFormatter={tickFormatter}
              stroke="#71717a"
              className="text-xs"
              tick={{ fill: '#71717a' }}
              label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<HobbyProgressTooltip trackingType={trackingType} goalTarget={goalTarget} />} />
            <Bar dataKey="value" fill={CHART_COLORS.neutral} radius={[4, 4, 0, 0]} name="value" />
            {data.some((d) => d.cumulative !== undefined) && (
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ r: 3, fill: CHART_COLORS.primary }}
                activeDot={{ r: 5, fill: CHART_COLORS.primary }}
                name="cumulative"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // PERCENTAGE: LineChart showing progress
  if (trackingType === 'PERCENTAGE') {
    return (
      <div className={`w-full ${className}`}>
        <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => formatChartDate(date, 'short')}
              stroke="#71717a"
              className="text-xs"
              tick={{ fill: '#71717a' }}
            />
            <YAxis
              tickFormatter={tickFormatter}
              stroke="#71717a"
              className="text-xs"
              tick={{ fill: '#71717a' }}
              label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<HobbyProgressTooltip trackingType={trackingType} goalTarget={goalTarget} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.positive}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLORS.positive }}
              activeDot={{ r: 6, fill: CHART_COLORS.positive }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // LIST: BarChart showing activity count
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatChartDate(date, 'short')}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <YAxis
            tickFormatter={tickFormatter}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
            label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<HobbyProgressTooltip trackingType={trackingType} goalTarget={goalTarget} />} />
          <Bar dataKey="value" fill={CHART_COLORS.neutral} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
