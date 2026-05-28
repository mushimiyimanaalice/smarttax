import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getAdminScopeLabel } from '../../utils/roles';
import { CheckCircle, XCircle, Building2, Search } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AdminApprovals = () => {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/businesses/pending');
      setBusinesses(res.data);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.post(`/admin/businesses/${id}/approve`);
      await load();
    } catch (e) { alert(e.response?.data?.message || 'Approval failed'); }
  };

  const reject = async (id) => {
    const reason = window.prompt('Rejection reason (optional):');
    if (reason === null) return;
    try {
      await api.post(`/admin/businesses/${id}/reject`, { reason });
      await load();
    } catch (e) { alert(e.response?.data?.message || 'Rejection failed'); }
  };

  const filtered = businesses.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.ownerId?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Approvals</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Scope: {getAdminScopeLabel(user)}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            placeholder="Search business or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Business</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>TIN</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Location</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Owner</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-secondary)', opacity: 0.3 }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No pending businesses</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>All businesses in your area have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="border-b transition-colors hover:bg-black/[0.02]" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-5 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 shrink-0" style={{ color: '#00A551' }} />
                        {b.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{b.taxIdentificationNumber}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {[b.address?.sector, b.address?.district, b.address?.province].filter(Boolean).join(', ')}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.ownerId?.fullName}</div>
                      <div className="text-xs">{b.ownerId?.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      {user?.role === 'sector_admin' || user?.role === 'district_admin' ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => approve(b._id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #00A551, #008040)' }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => reject(b._id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            style={{ borderColor: '#EF4444', color: '#EF4444', background: 'rgba(239,68,68,0.06)' }}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.03)' }}>
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;
