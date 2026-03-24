/**
 * Chart utilities and constants
 *
 * Per CONTEXT.md: "Color palette: Semantic colors (green=positive, red=negative, blue=neutral)"
 * Per CONTEXT.md: "Chart style: Minimal line/bar charts — Clean, data-focused, no 3D or gradients"
 */

/**
 * Semantic color constants for charts
 * Per CONTEXT.md: "green=positive, red=negative, blue=neutral"
 */
export const CHART_COLORS = {
  positive: '#22c55e', // green-500
  negative: '#ef4444', // red-500
  neutral: '#3b82f6', // blue-500
  primary: '#4f46e5', // indigo-600
} as const;

/**
 * Format date for chart X-axis labels
 * @param date - Date string or Date object
 * @param format - Format type ('short' = MM/DD, 'long' = Mon DD)
 * @returns Formatted date string
 */
export function formatChartDate(
  date: string | Date,
  format: 'short' | 'long' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  if (format === 'short') {
    // MM/DD format
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }

  // Mon DD format (e.g., "Jan 15")
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format currency value for chart display
 * @param value - Numeric value to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatChartCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage value for chart display
 * @param value - Numeric value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatChartPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number value for chart display
 * @param value - Numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatChartNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

/**
 * Common chart props interface
 * Generic type parameter T allows chart components to specify their data point type
 */
export interface BaseChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  days?: number;
  className?: string;
}

/**
 * Default chart dimensions
 */
export const CHART_DIMENSIONS = {
  height: 300,
  minHeight: 250,
  maxHeight: 400,
} as const;

/**
 * Time range preset options
 * Per CONTEXT.md: "Time ranges: Preset buttons (30d/90d/365d) + custom date picker"
 */
export const TIME_RANGES = [
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
  { value: 365, label: '365d' },
] as const;

export type TimeRangeValue = typeof TIME_RANGES[number]['value'];
