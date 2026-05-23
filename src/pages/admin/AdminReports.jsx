import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const AdminReports = () => {
  const [report, setReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    api
      .get('/admin/reports/tax-collection', {
        params: { startDate: start.toISOString(), endDate: end.toISOString() },
      })
      .then((res) => {
        setReport(
          (res.data || []).map((r) => ({
            date: r._id?.date || '—',
            total: r.total || 0,
            count: r.count || 0,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Tax collection reports</h2>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="h-96">
          {report.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" name="RWF collected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-20">No tax collection data for this period.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Amount (RWF)</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Transactions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {report.map((row, i) => (
              <tr key={i}>
                <td className="px-6 py-3">{row.date}</td>
                <td className="px-6 py-3 font-medium">{row.total.toLocaleString()}</td>
                <td className="px-6 py-3">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
