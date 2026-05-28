import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { Map, Building2, DollarSign, TrendingUp } from 'lucide-react';

const AdminDistrictMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/district-monitoring');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">District Monitoring</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Districts" value={data?.totalDistricts ?? 0} icon={Map} color="blue" />
        <StatCard title="Total Businesses" value={data?.totalBusinesses ?? 0} icon={Building2} color="green" />
        <StatCard title="Total Revenue" value={`RWF ${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="purple" />
        <StatCard title="Avg Compliance" value={`${data?.avgCompliance ?? 0}%`} icon={TrendingUp} color={data?.avgCompliance >= 80 ? 'green' : 'amber'} />
      </div>

      <div className="bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
        <h2 className="text-base font-semibold text-theme-primary mb-4">District Comparison</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.districts || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="businesses" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Businesses" />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDistrictMonitoring;
