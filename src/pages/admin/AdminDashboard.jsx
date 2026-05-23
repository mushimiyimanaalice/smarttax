import { useState, useEffect } from 'react';
import { Building2, DollarSign, ShoppingCart, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getAdminScopeLabel, getRoleLabel } from '../../utils/roles';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-slate-800">{value}</span>
    </div>
    <p className="text-sm text-slate-600 mt-3">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalSales: 0,
    totalTaxCollected: 0,
    pendingBusinesses: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      const [statsRes, revenueRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/reports/tax-collection', {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        }),
      ]);
      setStats(statsRes.data);
      setRevenueData(
        (revenueRes.data || []).map((row) => ({
          date: row._id?.date || '—',
          total: row.total || 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <p className="text-slate-600 mt-1">
          {getRoleLabel(user?.role)} — {getAdminScopeLabel(user)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="Businesses in your area"
          value={stats.totalBusinesses}
          color="bg-blue-500"
        />
        <StatCard
          icon={DollarSign}
          label="Tax collected"
          value={`RWF ${(stats.totalTaxCollected || 0).toLocaleString()}`}
          color="bg-green-500"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total sales"
          value={stats.totalSales}
          color="bg-purple-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Pending approvals"
          value={stats.pendingBusinesses}
          color="bg-amber-500"
        />
      </div>

      {stats.pendingBusinesses > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-amber-900">
            <strong>{stats.pendingBusinesses}</strong> business(es) waiting for approval in your jurisdiction.
          </p>
          <Link
            to="/admin/approvals"
            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700"
          >
            Review now
          </Link>
        </div>
      )}

      {revenueData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tax collection trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
