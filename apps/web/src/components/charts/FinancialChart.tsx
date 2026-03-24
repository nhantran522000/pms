/**
 * FinancialChart component for displaying income and expenses over time
 *
 * Per CONTEXT.md: "Color palette: Semantic colors (green=positive, red=negative)"
 * Per CONTEXT.md: "Chart style: Minimal line/bar charts — Clean, data-focused, no 3D or gradients"
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatChartDate, formatChartCurrency, CHART_COLORS, CHART_DIMENSIONS, type BaseChartProps } from '@/lib/chart-utils';

export interface FinancialDataPoint {
  date: string;
  income?: number;
  expense?: number;
}

export interface FinancialChartProps extends BaseChartProps<FinancialDataPoint> {
  currency?: string;
}

/**
 * Custom tooltip for financial chart
 */
function FinancialTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload?: FinancialDataPoint }> }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const income = payload.find((p) => p.name === 'income')?.value ?? 0;
  const expense = payload.find((p) => p.name === 'expense')?.value ?? 0;
  const date = payload[0].payload?.date;

  return (
    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">{formatChartDate(date, 'long')}</p>
      {income > 0 && (
        <p className="text-sm font-semibold text-green-600">
          Income: {formatChartCurrency(income)}
        </p>
      )}
      {expense > 0 && (
        <p className="text-sm font-semibold text-red-600">
          Expense: {formatChartCurrency(expense)}
        </p>
      )}
    </div>
  );
}

/**
 * Custom legend component
 */
function CustomLegend() {
  return (
    <div className="flex justify-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-green-500" />
        <span className="text-zinc-700 dark:text-zinc-300">Income</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-red-500" />
        <span className="text-zinc-700 dark:text-zinc-300">Expense</span>
      </div>
    </div>
  );
}

/**
 * FinancialChart component displays income (green) and expense (red) bars
 * Per CONTEXT.md: "Semantic colors (green=positive, red=negative)"
 */
export function FinancialChart({ data, days = 30, currency = 'USD', className = '' }: FinancialChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatChartDate(date, 'short')}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <YAxis
            tickFormatter={(value) => (value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`)}
            stroke="#71717a"
            className="text-xs"
            tick={{ fill: '#71717a' }}
          />
          <Tooltip content={<FinancialTooltip />} />
          <Legend content={<CustomLegend />} />
          <Bar
            dataKey="income"
            fill={CHART_COLORS.positive}
            radius={[4, 4, 0, 0]}
            name="income"
          />
          <Bar
            dataKey="expense"
            fill={CHART_COLORS.negative}
            radius={[4, 4, 0, 0]}
            name="expense"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
