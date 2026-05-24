import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminInactivityExplanations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/inactivity/explanations');
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
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Submitted Explanations</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-slate-600">Business</th>
                <th className="text-left p-3 font-medium text-slate-600">Date</th>
                <th className="text-left p-3 font-medium text-slate-600">Reason</th>
                <th className="text-left p-3 font-medium text-slate-600">Description</th>
                <th className="text-left p-3 font-medium text-slate-600">Status</th>
                <th className="text-right p-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, i) => (
                <tr key={item._id || i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{item.businessId?.name || 'N/A'}</td>
                  <td className="p-3 text-slate-600 text-xs">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3 capitalize text-slate-700">{item.reason?.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-600 max-w-[200px] truncate">{item.description}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                      item.status === 'flagged' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'reviewed' && <CheckCircle className="w-3 h-3" />}
                      {item.status === 'flagged' && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await api.patch(`/admin/inactivity/${item._id}/review`, { status: 'reviewed' });
                            setData((prev) => prev.map((d) => d._id === item._id ? { ...d, status: 'reviewed' } : d));
                          } catch (err) { console.error(err); }
                        }}
                        className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await api.patch(`/admin/inactivity/${item._id}/review`, { status: 'flagged' });
                            setData((prev) => prev.map((d) => d._id === item._id ? { ...d, status: 'flagged' } : d));
                          } catch (err) { console.error(err); }
                        }}
                        className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No explanations submitted
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInactivityExplanations;
