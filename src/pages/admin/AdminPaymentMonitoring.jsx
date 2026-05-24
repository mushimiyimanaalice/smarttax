import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { Wallet, Smartphone, CreditCard, TrendingUp } from 'lucide-react';

const AdminPaymentMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/payment-monitoring');
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
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Payment Monitoring</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Payments" value={`RWF ${(data?.totalPayments ?? 0).toLocaleString()}`} icon={Wallet} color="green" />
        <StatCard title="MoMo Payments" value={`RWF ${(data?.momoPayments ?? 0).toLocaleString()}`} icon={Smartphone} color="blue" />
        <StatCard title="Card Payments" value={`RWF ${(data?.cardPayments ?? 0).toLocaleString()}`} icon={CreditCard} color="purple" />
        <StatCard title="Success Rate" value={`${data?.successRate ?? 0}%`} icon={TrendingUp} color={data?.successRate >= 90 ? 'green' : 'amber'} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Payment Trend</h2>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentMonitoring;
