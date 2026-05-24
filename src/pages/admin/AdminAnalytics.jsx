import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { TrendingUp, DollarSign, Building2, Users } from 'lucide-react';

const AdminAnalytics = ({ scope = 'national' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const titles = {
    national: 'National Analytics',
    province: 'Provincial Analytics',
    district: 'District Analytics',
  };

  const endpoints = {
    national: '/admin/national-analytics',
    province: '/admin/provincial-analytics',
    district: '/admin/district-analytics',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get(endpoints[scope] || endpoints.national);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scope]);

  if (loading) return <LoadingSpinner />;

  const chartData = data?.monthlyRevenue || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{titles[scope]}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Revenue" value={`RWF ${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Active Businesses" value={data?.activeBusinesses ?? 0} icon={Building2} color="blue" />
        <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={Users} color="purple" />
        <StatCard title="Growth" value={`${data?.growth ?? 0}%`} icon={TrendingUp} color="amber" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Monthly Revenue</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {data?.topPerformers?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {data.topPerformers.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.metric}</p>
                </div>
                <span className="text-sm font-semibold text-green-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
