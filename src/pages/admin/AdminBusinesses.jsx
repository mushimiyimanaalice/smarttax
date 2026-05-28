import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getAdminScopeLabel } from '../../utils/roles';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-slate-100 text-theme-primary',
};

const AdminBusinesses = () => {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ province: '', district: '', sector: '' });
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.province) params.province = filters.province;
      if (filters.district) params.district = filters.district;
      if (filters.sector) params.sector = filters.sector;
      const res = await api.get('/admin/businesses/all', { params });
      setBusinesses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.province, filters.district, filters.sector]);

  const filtered = businesses.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.taxIdentificationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">Businesses</h2>
          <p className="text-theme-secondary mt-1">Scope: {getAdminScopeLabel(user)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Search name or TIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border border-slate-300 rounded-lg"
          />
          <input
            placeholder="Province"
            value={filters.province}
            onChange={(e) => setFilters({ ...filters, province: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            placeholder="District"
            value={filters.district}
            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            placeholder="Sector"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-theme-card rounded-xl border border-theme shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">TIN</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Province</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">District</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Sector</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Tax status</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-theme-secondary uppercase">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{b.name}</td>
                <td className="px-6 py-4 text-theme-secondary">{b.taxIdentificationNumber}</td>
                <td className="px-6 py-4 text-theme-secondary capitalize">{b.businessType}</td>
                <td className="px-6 py-4 text-sm">{b.address?.province || '—'}</td>
                <td className="px-6 py-4 text-sm">{b.address?.district || '—'}</td>
                <td className="px-6 py-4 text-sm">{b.address?.sector || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium ${b.taxStatus === 'pending' ? 'text-amber-600' : 'text-green-600'}`}>
                    {b.taxStatus || '—'}
                    {b.pendingTaxAmount > 0 && ` (RWF ${b.pendingTaxAmount.toLocaleString()})`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || statusColors.pending}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{b.ownerId?.fullName || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBusinesses;
