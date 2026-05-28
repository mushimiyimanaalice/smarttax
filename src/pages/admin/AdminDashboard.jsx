import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import api from '../../services/api';
import StatCard from '../../components/Common/StatCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Building2, DollarSign, TrendingUp, Clock,
  AlertCircle,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

const RWANDA_BLUE = '#003DA5';
const RWANDA_YELLOW = '#FAD201';
const RWANDA_GREEN = '#00A551';

const PIE_COLORS = ['#003DA5', '#00A551', '#FAD201', '#0088CC', '#66BB6A', '#FFD54F', '#2E7D32', '#1565C0'];

const STATUS_COLORS = {
  active: '#00A551', pending: '#FAD201', pending_approval: '#FAD201',
  rejected: '#EF4444', suspended: '#8B5CF6', inactive: '#94A3B8',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl shadow-2xl px-4 py-3 text-sm border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
      <p className="font-bold" style={{ color: RWANDA_GREEN }}>{d.value?.toLocaleString()}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/charts'),
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${RWANDA_BLUE} 0%, #002A7A 35%, ${RWANDA_GREEN} 65%, ${RWANDA_YELLOW} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-yellow-300/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-green-300/20 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
              Welcome, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm mt-1.5 opacity-90 drop-shadow-sm">
              {getRoleLabel(user?.role)} &middot; {getAdminScopeLabel(user)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-xs opacity-80">
            <div className="hidden xs:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Businesses"
          value={stats?.totalBusinesses ?? 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Tax Collected"
          value={`RWF ${(stats?.totalTaxCollected ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Sales"
          value={stats?.totalSales ?? 0}
          icon={TrendingUp}
          color="yellow"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingBusinesses ?? 0}
          icon={Clock}
          color={stats?.pendingBusinesses > 0 ? 'yellow' : 'green'}
          subtitle={stats?.pendingBusinesses > 0 ? 'Action required' : 'All clear'}
          onClick={() => navigate('/admin/approvals')}
        />
      </div>

      {stats?.pendingBusinesses > 0 && (
        <div
          className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 border border-yellow-200/50"
          style={{ background: 'linear-gradient(135deg, rgba(250,210,1,0.12) 0%, rgba(250,210,1,0.04) 100%)' }}
        >
          <div className="p-2 rounded-lg" style={{ background: `${RWANDA_YELLOW}20` }}>
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: RWANDA_YELLOW }} />
          </div>
          <p className="text-sm font-medium text-slate-700 flex-1">
            <strong>{stats.pendingBusinesses}</strong> business(es) awaiting approval.
            <button
              onClick={() => navigate('/admin/approvals')}
              className="ml-2 underline font-semibold hover:no-underline"
              style={{ color: RWANDA_BLUE }}
            >
              Review now
            </button>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {chartData?.byProvince?.length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
              Businesses by Province
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData.byProvince}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={1400}
                  animationEasing="ease-out"
                >
                  {chartData.byProvince.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                  iconType="circle"
                  iconSize={7}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData?.byStatus?.length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
              Business Status
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData.byStatus}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive
                  animationBegin={200}
                  animationDuration={1400}
                  animationEasing="ease-out"
                >
                  {chartData.byStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => value.replace(/_/g, ' ')}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {chartData?.monthlyTax?.length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
              Monthly Tax Collection
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.monthlyTax} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94A3B8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  fill={RWANDA_GREEN}
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                  animationBegin={400}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData?.monthlyTax?.length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs sm:text-sm font-semibold mb-4 tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
              Tax Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData.monthlyTax} margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94A3B8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={RWANDA_BLUE}
                  strokeWidth={2.5}
                  dot={{ fill: RWANDA_BLUE, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: RWANDA_YELLOW, stroke: RWANDA_BLUE, strokeWidth: 2 }}
                  isAnimationActive
                  animationBegin={600}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
