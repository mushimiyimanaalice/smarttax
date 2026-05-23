import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminInactivity = () => {
  const [data, setData] = useState({ reports: [], inactiveToday: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/inactivity')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Inactivity monitoring</h2>

      <section>
        <h3 className="text-lg font-semibold mb-3">Inactive today (no explanation yet)</h3>
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.inactiveToday
                .filter((d) => !d.explanationSubmitted)
                .map((d) => (
                  <tr key={d._id}>
                    <td className="px-4 py-3">{d.businessId?.name}</td>
                    <td className="px-4 py-3">{d.userId?.fullName}</td>
                    <td className="px-4 py-3">
                      {d.businessId?.address?.sector}, {d.businessId?.address?.district}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Submitted explanations</h3>
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.reports.map((r) => (
                <tr key={r._id}>
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{r.businessId?.name}</td>
                  <td className="px-4 py-3 capitalize">{r.reason?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-100">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminInactivity;
