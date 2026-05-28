import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Smartphone, Search } from 'lucide-react';

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
};

const AdminMomoTransactions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/momo-transactions');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter((t) =>
    t.reference?.toLowerCase().includes(search.toLowerCase()) ||
    t.phoneNumber?.includes(search)
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">MoMo Transactions</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by reference or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="bg-theme-card rounded-xl border border-theme overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-theme-secondary">Reference</th>
                <th className="text-left p-3 font-medium text-theme-secondary">Phone</th>
                <th className="text-left p-3 font-medium text-theme-secondary">Provider</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Amount</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Status</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t, i) => (
                <tr key={t._id || i} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs text-slate-700">{t.reference || 'N/A'}</td>
                  <td className="p-3 text-slate-700">{t.phoneNumber}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-theme-secondary capitalize">
                      <Smartphone className="w-3 h-3" /> {t.provider}
                    </span>
                  </td>
                  <td className="p-3 text-right font-medium text-theme-primary">RWF {t.amount?.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] || 'bg-slate-100 text-theme-secondary'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-xs text-slate-500">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMomoTransactions;
