import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Calendar, CheckCircle, X } from 'lucide-react';

const AdminPaymentPlans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ businessId: '', totalAmount: '', installments: '', startDate: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/payment-plans');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/payment-plans', form);
      setShowCreate(false);
      setForm({ businessId: '', totalAmount: '', installments: '', startDate: '' });
      const { data: res } = await api.get('/admin/payment-plans');
      setData(res);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create plan');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Payment Plans</h1>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
          Create Plan
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-theme-card rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Payment Plan</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-3">
              <input placeholder="Business ID" value={form.businessId} onChange={(e) => setForm({ ...form, businessId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              <input type="number" placeholder="Total Amount" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              <input type="number" placeholder="Number of Installments" value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              <button type="submit" className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-sm">Create Plan</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-theme-card rounded-xl border border-theme overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-theme-secondary">Business</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Total</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Installments</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Remaining</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Status</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((plan, i) => (
                <tr key={plan._id || i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-theme-primary">{plan.businessId?.name || 'N/A'}</td>
                  <td className="p-3 text-right text-slate-700">RWF {plan.totalAmount?.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-700">{plan.installments}</td>
                  <td className="p-3 text-right text-slate-700">RWF {plan.remainingAmount?.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      plan.status === 'completed' ? 'bg-green-100 text-green-700' :
                      plan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{plan.status}</span>
                  </td>
                  <td className="p-3 text-right text-xs text-slate-500">{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payment plans found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentPlans;
