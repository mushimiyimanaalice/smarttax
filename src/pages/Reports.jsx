import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StatCard from '../components/Common/StatCard';
import { TrendingUp, DollarSign, ShoppingCart, Percent } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salesData } = await api.get('/sales/report/monthly');
        const { data: taxData } = await api.get('/taxes/summary');
        setData({ sales: salesData, taxes: taxData });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const revenueData = Array.isArray(data?.sales) ? data.sales : [];
  const summary = data?.taxes || {};

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Reports & Analytics</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Total Revenue" value={`RWF ${(summary.totalPaid || 0).toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Total Sales" value={revenueData.reduce((s, r) => s + (r.count || 0), 0)} icon={ShoppingCart} color="blue" />
        <StatCard title="Pending Tax" value={`RWF ${(summary.totalPending || 0).toLocaleString()}`} icon={TrendingUp} color="amber" />
        <StatCard title="Tax Compliance" value={summary.complianceRate ? `${summary.complianceRate.toFixed(1)}%` : '0%'} icon={Percent} color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Revenue Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Tax Breakdown</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Paid', amount: summary.totalPaid || 0 },
              { name: 'Pending', amount: summary.totalPending || 0 },
              { name: 'Overdue', amount: summary.totalOverdue || 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
