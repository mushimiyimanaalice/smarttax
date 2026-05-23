import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminCompliance = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/compliance-reports')
      .then((res) => setReports(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Compliance overview</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Business</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Reg. #</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Tax due</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Tax paid</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Compliance %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{r.name}</td>
                <td className="px-6 py-4 text-slate-600">{r.registrationNumber}</td>
                <td className="px-6 py-4">RWF {(r.totalTaxDue || 0).toLocaleString()}</td>
                <td className="px-6 py-4">RWF {(r.totalTaxPaid || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${(r.complianceRate || 0) >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                    {Number.isFinite(r.complianceRate) ? `${Math.round(r.complianceRate)}%` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCompliance;
