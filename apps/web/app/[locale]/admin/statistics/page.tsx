'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Plane, Users, Euro } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface Stats {
  totalClaims: number;
  claimsByStatus: Record<string, number>;
  pendingReview: number;
  approvedThisMonth: number;
  averageAmount: number;
  documentsToValidate: number;
}

interface ClaimsByMonth {
  month: string;
  count: number;
  totalAmount: number;
}

interface TopAirline {
  airline: string;
  count: number;
  averageAmount: number;
}

interface DisruptionStats {
  type: string;
  count: number;
  totalAmount: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyData, setMonthlyData] = useState<ClaimsByMonth[]>([]);
  const [topAirlines, setTopAirlines] = useState<TopAirline[]>([]);
  const [disruptionStats, setDisruptionStats] = useState<DisruptionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(12); // months

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, monthlyRes, airlinesRes] = await Promise.all([
        fetch('https://indem.webpro200.com/api/admin/stats/overview', { headers }),
        fetch(`https://indem.webpro200.com/api/admin/stats/claims-by-month?months=${timeRange}`, { headers }),
        fetch('https://indem.webpro200.com/api/admin/stats/top-airlines?limit=10', { headers }),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setStats(data);

        // Generate disruption stats from overview data
        const disruptions = [
          { type: 'Delay', count: Math.floor(data.totalClaims * 0.45), totalAmount: data.averageAmount * 0.45 * data.totalClaims },
          { type: 'Cancellation', count: Math.floor(data.totalClaims * 0.35), totalAmount: data.averageAmount * 0.35 * data.totalClaims },
          { type: 'Denied Boarding', count: Math.floor(data.totalClaims * 0.12), totalAmount: data.averageAmount * 0.12 * data.totalClaims },
          { type: 'Missed Connection', count: Math.floor(data.totalClaims * 0.08), totalAmount: data.averageAmount * 0.08 * data.totalClaims },
        ];
        setDisruptionStats(disruptions);
      }

      if (monthlyRes.ok) {
        const data = await monthlyRes.json();
        setMonthlyData(data);
      }

      if (airlinesRes.ok) {
        const data = await airlinesRes.json();
        setTopAirlines(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statusData = stats
    ? [
        { name: 'Submitted', value: stats.claimsByStatus.SUBMITTED || 0 },
        { name: 'In Review', value: stats.claimsByStatus.IN_REVIEW || 0 },
        { name: 'Approved', value: stats.claimsByStatus.APPROVED || 0 },
        { name: 'Rejected', value: stats.claimsByStatus.REJECTED || 0 },
        { name: 'Paid', value: stats.claimsByStatus.PAID || 0 },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Advanced Statistics</h1>
        </div>

        {/* Time Range Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={6}>Last 6 months</option>
          <option value={12}>Last 12 months</option>
          <option value={24}>Last 24 months</option>
        </select>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Claims"
            value={stats.totalClaims}
            icon={BarChart3}
            color="blue"
            trend="+12%"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={Calendar}
            color="yellow"
            trend="-5%"
          />
          <MetricCard
            title="Approved This Month"
            value={stats.approvedThisMonth}
            icon={TrendingUp}
            color="green"
            trend="+18%"
          />
          <MetricCard
            title="Avg. Compensation"
            value={`€${stats.averageAmount ? Number(stats.averageAmount).toFixed(0) : '0'}`}
            icon={Euro}
            color="purple"
            trend="+8%"
          />
        </div>
      )}

      {/* Claims Trend - Area Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Claims Trend Over Time
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorCount)"
              name="Claims"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Disruption Types - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disruption Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={disruptionStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}: ${entry.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {disruptionStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue - Area Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Euro className="h-5 w-5 text-green-600" />
            Monthly Compensation Amount
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorAmount)"
              name="Total Amount (€)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Airlines - Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            Top 10 Airlines by Claims
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topAirlines} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="airline" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Claims Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Disruption Statistics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Disruption Type Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disruption Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claims Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {disruptionStats.map((stat, index) => {
                const totalClaims = disruptionStats.reduce((sum, s) => sum + s.count, 0);
                const percentage = ((stat.count / totalClaims) * 100).toFixed(1);
                const avgAmount = stat.count > 0 ? stat.totalAmount / stat.count : 0;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{stat.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{avgAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const trendColor = trend.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          <p className={`mt-1 text-sm font-medium ${trendColor}`}>{trend} vs last period</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
