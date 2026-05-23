import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getAdminScopeLabel } from '../../utils/roles';

const AdminApprovals = () => {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/businesses/pending');
      setBusinesses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    try {
      await api.post(`/admin/businesses/${id}/approve`);
      await load();
      alert('Business approved — now ACTIVE');
    } catch (e) {
      alert(e.response?.data?.message || 'Approval failed');
    }
  };

  const reject = async (id) => {
    const reason = window.prompt('Rejection reason (optional):');
    if (reason === null) return;
    try {
      await api.post(`/admin/businesses/${id}/reject`, { reason });
      await load();
      alert('Business rejected');
    } catch (e) {
      alert(e.response?.data?.message || 'Rejection failed');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pending approvals</h2>
        <p className="text-slate-600 mt-1">Scope: {getAdminScopeLabel(user)}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Business</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">TIN</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Owner</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {businesses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No pending businesses in your area.
                </td>
              </tr>
            ) : (
              businesses.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{b.name}</td>
                  <td className="px-6 py-4 text-slate-600">{b.taxIdentificationNumber}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {[b.address?.sector, b.address?.district, b.address?.province].filter(Boolean).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {b.ownerId?.fullName}
                    <br />
                    <span className="text-xs">{b.ownerId?.email}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => approve(b._id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(b._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApprovals;
