import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { TrendingUp, DollarSign, Building2, CheckCircle } from 'lucide-react';

const AdminProvincePerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/province-performance');
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
      <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Province Performance</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Best Province" value={data?.bestProvince?.name || 'N/A'} icon={TrendingUp} color="green" subtitle={`RWF ${(data?.bestProvince?.revenue ?? 0).toLocaleString()}`} />
        <StatCard title="Total Revenue" value={`RWF ${(data?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="blue" />
        <StatCard title="Total Businesses" value={data?.totalBusinesses ?? 0} icon={Building2} color="purple" />
        <StatCard title="Compliance Rate" value={`${data?.complianceRate ?? 0}%`} icon={CheckCircle} color={data?.complianceRate >= 80 ? 'green' : 'amber'} />
      </div>

      <div className=" bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
        <h2 className="text-base font-semibold text-theme-primary mb-4">Province Comparison</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.provinces || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Revenue" />
              <Bar dataKey="businesses" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Businesses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className=" bg-theme-card rounded-xl border border-theme overflow-hidden">
        <div className="p-4 border-b border-theme">
          <h2 className="text-base font-semibold text-theme-primary">All Provinces</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-theme-secondary">Province</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Revenue</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Businesses</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.provinces || []).map((p, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-theme-primary">{p.name}</td>
                  <td className="p-3 text-right text-slate-700">RWF {p.revenue.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-700">{p.businesses}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.compliance >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.compliance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProvincePerformance;
