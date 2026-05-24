import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import { Save, User } from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/admin/profile', form);
      updateUser(data);
      setMessage('Profile updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Profile Settings</h1>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{getRoleLabel(user?.role)}</p>
            <p className="text-xs text-slate-400">{getAdminScopeLabel(user)}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={user?.email || ''} disabled className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full Name</span>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone Number</span>
            <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
