import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { Activity, Users, Clock, AlertTriangle } from 'lucide-react';

const AdminActivityMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/activity-monitoring', { params: { period } });
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Activity Monitoring</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                period === p ? 'bg-green-600 text-white' : 'bg-slate-100 text-theme-secondary hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Active Today" value={data?.activeToday ?? 0} icon={Activity} color="green" />
        <StatCard title="Inactive Today" value={data?.inactiveToday ?? 0} icon={Clock} color={data?.inactiveToday > 0 ? 'amber' : 'green'} />
        <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={Users} color="blue" />
        <StatCard title="Flagged" value={data?.flagged ?? 0} icon={AlertTriangle} color="red" />
      </div>

      <div className="bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
        <h2 className="text-base font-semibold text-theme-primary mb-4">Daily Activity Trend</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="inactive" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityMonitoring;
