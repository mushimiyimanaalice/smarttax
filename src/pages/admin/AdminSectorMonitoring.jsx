import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { Map, Building2, Clock, CheckCircle } from 'lucide-react';

const AdminSectorMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/sector-monitoring');
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
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Sector Monitoring</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Sectors" value={data?.totalSectors ?? 0} icon={Map} color="blue" />
        <StatCard title="Businesses" value={data?.totalBusinesses ?? 0} icon={Building2} color="green" />
        <StatCard title="Pending Approvals" value={data?.pendingApprovals ?? 0} icon={Clock} color="amber" />
        <StatCard title="Approval Rate" value={`${data?.approvalRate ?? 0}%`} icon={CheckCircle} color={data?.approvalRate >= 80 ? 'green' : 'amber'} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Sectors Overview</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.sectors || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="businesses" fill="#10b981" radius={[4, 4, 0, 0]} name="Businesses" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSectorMonitoring;
