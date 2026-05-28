import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel, getRoleBadgeColor } from '../../utils/roles';
import { Users, UserPlus, Search, X, User, Mail, Lock, Phone, Shield, MapPin, Map, Layers } from 'lucide-react';
import { PROVINCES, DISTRICTS_MAP, SECTORS_MAP, normalizeProvince } from '../../data/rwandaGeo';

const iconMap = { User, Mail, Lock, Phone, Shield, MapPin, Map, Layers };

const IconInput = ({ icon, placeholder, value, onChange, type = 'text', required }) => {
  const Icon = iconMap[icon] || User;
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2"
        style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      />
    </div>
  );
};

const IconSelect = ({ icon, value, onChange, children, required, disabled }) => {
  const Icon = iconMap[icon] || Shield;
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10" style={{ color: 'var(--text-secondary)' }}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2 appearance-none"
        style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        {children}
      </select>
    </div>
  );
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
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">{title}</h1>
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
          className="w-full pl-10 pr-4 py-2.5 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-theme-card rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <h2 className="text-lg font-semibold text-theme-primary">Create Admin User</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <IconInput icon="User" placeholder="Full Name" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} required />
              <IconInput icon="Mail" type="email" placeholder="Email address" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
              <IconInput icon="Lock" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required />
              <IconInput icon="Phone" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => updateForm('phoneNumber', e.target.value)} required />

              <IconSelect icon="Shield" value={form.role} onChange={(e) => updateForm('role', e.target.value)}>
                {getAvailableRoles().map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </IconSelect>

              {requiresProvince && (
                <IconSelect icon="MapPin" value={form.province} onChange={(e) => updateForm('province', e.target.value)} required>
                  <option value="">Select Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </IconSelect>
              )}

              {requiresDistrict && (
                <IconSelect icon="Map" value={form.district} onChange={(e) => updateForm('district', e.target.value)}
                  required disabled={!form.province || availableDistricts.length === 0}>
                  <option value="">Select District</option>
                  {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </IconSelect>
              )}

              {requiresSector && (
                availableSectors ? (
                  <IconSelect icon="Layers" value={form.sector} onChange={(e) => updateForm('sector', e.target.value)} required disabled={!form.district}>
                    <option value="">Select Sector</option>
                    {availableSectors.map((s) => <option key={s} value={s}>{s}</option>)}
                  </IconSelect>
                ) : (
                  <IconInput icon="Layers" placeholder="Sector" value={form.sector} onChange={(e) => updateForm('sector', e.target.value)} required />
                )
              )}

              {user?.role !== 'national_admin' && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-medium" style={{ background: 'rgba(0,165,81,0.06)', color: '#00A551' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  Will be created under: {[user?.province, user?.district].filter(Boolean).join(', ')}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #00A551, #008040)' }}
              >
                Create Admin
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Name</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Role</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Scope</th>
                <th className="text-right p-3 font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-b transition-colors hover:bg-black/[0.02]" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>{u.fullName}</td>
                  <td className="p-3" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {[u.province, u.district, u.sector].filter(Boolean).join(', ') || 'N/A'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs font-medium transition-colors hover:text-red-800 disabled:opacity-30"
                      style={{ color: '#EF4444' }}
                      disabled={user?.role !== 'national_admin'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No admin users found</td>
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
