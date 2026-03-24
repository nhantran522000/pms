/**
 * WeightChart component for displaying weight trends over time
 *
 * Per CONTEXT.md: "Chart style: Minimal line/bar charts — Clean, data-focused, no 3D or gradients"
 * Per CONTEXT.md: "Interactivity: Tooltips on hover"
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatChartDate, CHART_COLORS, CHART_DIMENSIONS, type BaseChartProps } from '@/lib/chart-utils';

export interface WeightDataPoint {
  date: string;
  weight: number;
}

export interface WeightChartProps extends BaseChartProps<WeightDataPoint> {
  unit?: 'kg' | 'lbs';
}

/**
 * Custom tooltip for weight chart
 */
function WeightTooltip({ active, payload, unit }: { active?: boolean; payload?: Array<{ value: number; payload?: WeightDataPoint }>; unit?: 'kg' | 'lbs' }) {
  if (!active || !payload || !payload[0]) {
    return null;
  }

  const data = payload[0].payload;
  if (!data) return null;
  const weight = payload[0].value;

  return (
    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{formatChartDate(data.date, 'long')}</p>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {weight.toFixed(1)} {unit || 'lbs'}
      </p>
    </div>
  );
}

/**
 * WeightChart component displays weight trend line
 * Per CONTEXT.md: "Minimal line/bar charts"
 */
export function WeightChart({ data, days = 30, unit = 'lbs', className = '' }: WeightChartProps) {
  // Determine Y-axis decimals based on unit
  const getDecimals = () => (unit === 'lbs' ? 0 : 1);

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
            tickFormatter={(value) => value.toFixed(getDecimals())}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <Tooltip content={<WeightTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 4, fill: CHART_COLORS.primary }}
            activeDot={{ r: 6, fill: CHART_COLORS.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
