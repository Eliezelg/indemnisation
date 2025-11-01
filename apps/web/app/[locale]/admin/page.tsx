'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Plane,
  Calendar
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OverviewStats {
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

interface RecentClaim {
  id: string;
  claimNumber: string;
  flightNumber: string;
  status: string;
  recommendedAmount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<ClaimsByMonth[]>([]);
  const [topAirlines, setTopAirlines] = useState<TopAirline[]>([]);
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [overviewRes, monthlyRes, airlinesRes, recentRes] = await Promise.all([
        fetch('https://indem.webpro200.com/api/admin/stats/overview', { headers }),
        fetch('https://indem.webpro200.com/api/admin/stats/claims-by-month?months=6', { headers }),
        fetch('https://indem.webpro200.com/api/admin/stats/top-airlines?limit=5', { headers }),
        fetch('https://indem.webpro200.com/api/admin/stats/recent-claims?limit=10', { headers }),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setStats(data);
      }

      if (monthlyRes.ok) {
        const data = await monthlyRes.json();
        setMonthlyData(data);
      }

      if (airlinesRes.ok) {
        const data = await airlinesRes.json();
        setTopAirlines(data);
      }

      if (recentRes.ok) {
        const data = await recentRes.json();
        setRecentClaims(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Prepare pie chart data
  const statusData = stats ? [
    { name: 'Submitted', value: stats.claimsByStatus.SUBMITTED || 0 },
    { name: 'In Review', value: stats.claimsByStatus.IN_REVIEW || 0 },
    { name: 'Approved', value: stats.claimsByStatus.APPROVED || 0 },
    { name: 'Rejected', value: stats.claimsByStatus.REJECTED || 0 },
    { name: 'Paid', value: stats.claimsByStatus.PAID || 0 },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Claims"
          value={stats?.totalClaims || 0}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingReview || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved This Month"
          value={stats?.approvedThisMonth || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Avg. Amount"
          value={`€${stats?.averageAmount ? Number(stats.averageAmount).toFixed(0) : '0'}`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims by Month - Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Claims by Month
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} name="Claims" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Claims by Status - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Claims by Status
          </h3>
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
      </div>

      {/* Top Airlines - Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-600" />
          Top Airlines by Claims
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topAirlines}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="airline" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" name="Claims Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.claimNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.flightNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.user.firstName} {claim.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={claim.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{claim.recommendedAmount ? Number(claim.recommendedAmount).toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
    IN_REVIEW: { label: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    PAID: { label: 'Paid', color: 'bg-purple-100 text-purple-800' },
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
