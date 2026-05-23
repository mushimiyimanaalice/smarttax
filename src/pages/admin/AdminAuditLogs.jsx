import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/audit-logs')
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Audit logs</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">When</th>
              <th className="px-6 py-4 font-semibold text-slate-600">User</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Action</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No audit logs yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-600">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">{log.userId?.fullName || log.userId?.email || '—'}</td>
                  <td className="px-6 py-3 font-medium">{log.action}</td>
                  <td className="px-6 py-3 text-slate-600">{log.targetType} {log.targetId?.toString().slice(-6)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
