import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel, getAdminScopeLabel, getAdminNavItems } from '../../utils/roles';
import api from '../../services/api';
import StatCard from '../../components/Common/StatCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Building2, DollarSign, TrendingUp, Clock, Users,
  AlertCircle, CheckCircle, FileText, Activity,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navItems = getAdminNavItems(user?.role);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Welcome, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500">
            {getRoleLabel(user?.role)} &middot; {getAdminScopeLabel(user)}
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
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
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingBusinesses ?? 0}
          icon={Clock}
          color={stats?.pendingBusinesses > 0 ? 'amber' : 'green'}
          subtitle={stats?.pendingBusinesses > 0 ? 'Action required' : 'All clear'}
          onClick={() => navigate('/admin/approvals')}
        />
      </div>

      {stats?.pendingBusinesses > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{stats.pendingBusinesses}</strong> business(es) awaiting approval.
            <button
              onClick={() => navigate('/admin/approvals')}
              className="ml-2 text-amber-700 underline font-medium hover:text-amber-900"
            >
              Review now
            </button>
          </p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {navItems.slice(0, 8).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-md transition-all active:scale-95"
            >
              <span className="text-2xl">
                <Activity className="w-6 h-6 text-green-600" />
              </span>
              <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
