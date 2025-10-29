'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Lazy load Recharts components with loading fallback
const ChartLoader = () => (
  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
    <div className="animate-pulse space-y-4 w-full p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Lazy load LineChart
export const LazyLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart as any),
  {
    loading: () => <ChartLoader />,
    ssr: false, // Disable SSR for charts (they're client-side only)
  }
);

// Lazy load Line
export const LazyLine = dynamic(
  () => import('recharts').then((mod) => mod.Line as any),
  { ssr: false }
);

// Lazy load BarChart
export const LazyBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart as any),
  {
    loading: () => <ChartLoader />,
    ssr: false,
  }
);

// Lazy load Bar
export const LazyBar = dynamic(
  () => import('recharts').then((mod) => mod.Bar as any),
  { ssr: false }
);

// Lazy load PieChart
export const LazyPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart as any),
  {
    loading: () => <ChartLoader />,
    ssr: false,
  }
);

// Lazy load Pie
export const LazyPie = dynamic(
  () => import('recharts').then((mod) => mod.Pie as any),
  { ssr: false }
);

// Lazy load Cell
export const LazyCell = dynamic(
  () => import('recharts').then((mod) => mod.Cell as any),
  { ssr: false }
);

// Lazy load common chart components
export const LazyXAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis as any),
  { ssr: false }
);

export const LazyYAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis as any),
  { ssr: false }
);

export const LazyCartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid as any),
  { ssr: false }
);

export const LazyTooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip as any),
  { ssr: false }
);

export const LazyLegend = dynamic(
  () => import('recharts').then((mod) => mod.Legend as any),
  { ssr: false }
);

export const LazyResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer as any),
  { ssr: false }
);

// Alternative: Load entire Recharts at once (simpler but larger bundle)
export const RechartsComponents = dynamic(
  () => import('recharts').then((mod) => ({
    default: () => null, // Placeholder, use named exports instead
    ...mod,
  })),
  {
    loading: () => <ChartLoader />,
    ssr: false,
  }
);
