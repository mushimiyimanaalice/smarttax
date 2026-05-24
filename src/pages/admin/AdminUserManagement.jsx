import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel, getRoleBadgeColor } from '../../utils/roles';
import { Users, UserPlus, Search, X } from 'lucide-react';

const PROVINCES = [
  'City of Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province',
];

const PROVINCE_ALIAS = {
  kigali: 'City of Kigali',
  northern: 'Northern Province',
  southern: 'Southern Province',
  eastern: 'Eastern Province',
  western: 'Western Province',
};

const DISTRICTS_MAP = {
  'City of Kigali': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
};

const SECTORS_MAP = {
  'Gasabo': ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Remera', 'Rusororo', 'Rutunga'],
  'Kicukiro': ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
  'Nyarugenge': ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo'],
};

const normalizeProvince = (p) => {
  if (!p) return '';
  if (DISTRICTS_MAP[p]) return p;
  const alias = PROVINCE_ALIAS[p.toLowerCase().trim()];
  return alias || p;
};

const AdminUserManagement = ({ filter }) => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phoneNumber: '',
    role: user?.role === 'national_admin' ? 'provincial_admin' : 'district_admin',
    province: normalizeProvince(user?.province) || '',
    district: user?.district || '',
    sector: '',
  });

  const title = filter
    ? { provincial_admin: 'Provincial Admins', district_admin: 'District Admins', sector_admin: 'Sector Admins' }[filter] || 'User Management'
    : 'User Management';

  const canCreate = user?.role === 'national_admin' || user?.role === 'provincial_admin' || user?.role === 'district_admin';

  const getAvailableRoles = () => {
    if (user?.role === 'national_admin') {
      return [
        { value: 'provincial_admin', label: 'Provincial Admin' },
        { value: 'district_admin', label: 'District Admin' },
        { value: 'sector_admin', label: 'Sector Admin' },
      ];
    }
    if (user?.role === 'provincial_admin') {
      return [
        { value: 'district_admin', label: 'District Admin' },
        { value: 'sector_admin', label: 'Sector Admin' },
      ];
    }
    if (user?.role === 'district_admin') {
      return [
        { value: 'sector_admin', label: 'Sector Admin' },
      ];
    }
    return [];
  };

  const requiresProvince = user?.role === 'national_admin' && ['provincial_admin', 'district_admin', 'sector_admin'].includes(form.role);
  const requiresDistrict = form.role === 'district_admin' || form.role === 'sector_admin';
  const requiresSector = form.role === 'sector_admin';

  const availableDistricts = form.province ? DISTRICTS_MAP[normalizeProvince(form.province)] || [] : [];
  const availableSectors = form.district ? SECTORS_MAP[form.district] || null : null;

  const fetchUsers = async () => {
    try {
      const params = filter ? { role: filter } : {};
      const { data } = await api.get('/admin/users/admins', { params });
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    if (user) {
      const defaultRole = user.role === 'national_admin' ? 'provincial_admin' : user.role === 'provincial_admin' ? 'district_admin' : 'sector_admin';
      setForm((prev) => ({
        ...prev,
        role: defaultRole,
        province: normalizeProvince(user.province) || prev.province,
        district: user.district || prev.district,
      }));
    }
  }, [user]);

  const updateForm = (key, value) => {
    const updated = { ...form, [key]: key === 'province' ? normalizeProvince(value) : value };
    if (key === 'province') { updated.district = ''; updated.sector = ''; }
    if (key === 'district') { updated.sector = ''; }
    if (key === 'role') {
      updated.district = '';
      updated.sector = '';
      updated.province = user?.role === 'national_admin' ? normalizeProvince(updated.province) : normalizeProvince(user?.province) || '';
    }
    setForm(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users/admins', form);
      setShowCreate(false);
      setForm({ email: '', password: '', fullName: '', phoneNumber: '', role: 'sector_admin', province: normalizeProvince(user?.province) || '', district: user?.district || '', sector: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
        {canCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            Create Admin
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Create Admin User</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-3">
              <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => updateForm('password', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
              <input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => updateForm('phoneNumber', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />

              <select value={form.role} onChange={(e) => updateForm('role', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                {getAvailableRoles().map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

              {requiresProvince && (
                <select value={form.province} onChange={(e) => updateForm('province', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required>
                  <option value="">Select Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              )}

              {requiresDistrict && (
                <select value={form.district} onChange={(e) => updateForm('district', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  required disabled={!form.province || availableDistricts.length === 0}>
                  <option value="">Select District</option>
                  {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              )}

              {requiresSector && (
                availableSectors ? (
                  <select value={form.sector} onChange={(e) => updateForm('sector', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required disabled={!form.district}>
                    <option value="">Select Sector</option>
                    {availableSectors.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input placeholder="Sector" value={form.sector} onChange={(e) => updateForm('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" required />
                )
              )}

              {user?.role !== 'national_admin' && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-500">
                  Will be created under: {[user?.province, user?.district].filter(Boolean).join(', ')}
                </div>
              )}

              <button type="submit" className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition text-sm">Create Admin</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-slate-600">Name</th>
                <th className="text-left p-3 font-medium text-slate-600">Email</th>
                <th className="text-left p-3 font-medium text-slate-600">Role</th>
                <th className="text-left p-3 font-medium text-slate-600">Scope</th>
                <th className="text-right p-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{u.fullName}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-slate-500">
                    {[u.province, u.district, u.sector].filter(Boolean).join(', ') || 'N/A'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                      disabled={user?.role !== 'national_admin'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">No admin users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
