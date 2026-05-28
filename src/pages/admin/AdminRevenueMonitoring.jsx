import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { DollarSign, TrendingUp, Wallet, Calendar } from 'lucide-react';

const AdminRevenueMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/revenue-monitoring', { params: { period } });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Revenue Monitoring</h1>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                period === p ? 'bg-green-600 text-white' : 'bg-slate-100 text-theme-secondary hover:bg-slate-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Revenue" value={`RWF ${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Expected Revenue" value={`RWF ${(data?.expectedRevenue ?? 0).toLocaleString()}`} icon={TrendingUp} color="blue" />
        <StatCard title="Collected" value={`${data?.collectionRate ?? 0}%`} icon={Wallet} color="amber" />
        <StatCard title="Outstanding" value={`RWF ${(data?.outstanding ?? 0).toLocaleString()}`} icon={Calendar} color="red" />
      </div>

      <div className=" bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
        <h2 className="text-base font-semibold text-theme-primary mb-4">
          {period.charAt(0).toUpperCase() + period.slice(1)} Revenue Trend
        </h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="expected" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data?.byMethod?.length > 0 && (
        <div className=" bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
          <h2 className="text-base font-semibold text-theme-primary mb-4">Revenue by Payment Method</h2>
          <div className="space-y-3">
            {data.byMethod.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 capitalize">{item.method}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-theme-primary">RWF {item.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{item.count} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenueMonitoring;
