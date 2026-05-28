import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import { Save, User, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phoneNumber: user?.phoneNumber || '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/admin/profile', form);
      updateUser(data);
      setMessage('Profile updated successfully');
      setMsgType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
      setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ icon: Icon, label, value, onChange, disabled, type = 'text' }) => (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60"
          style={{
            background: 'var(--bg-input)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            '--tw-ring-color': '#00A551',
          }}
        />
      </div>
    </label>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your personal information</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
            msgType === 'success' ? 'border-green-200' : 'border-red-200'
          }`}
          style={{
            background: msgType === 'success' ? 'rgba(0,165,81,0.08)' : 'rgba(239,68,68,0.08)',
            color: msgType === 'success' ? '#00A551' : '#EF4444',
          }}
        >
          {msgType === 'success' ? <CheckCircle className="w-4.5 h-4.5 shrink-0" /> : <XCircle className="w-4.5 h-4.5 shrink-0" />}
          {message}
        </div>
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user?.fullName}</h2>
            <p className="text-sm font-medium" style={{ color: '#00A551' }}>{getRoleLabel(user?.role)}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getAdminScopeLabel(user)}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          <InputField icon={Mail} label="Email" value={user?.email || ''} disabled />
          <InputField icon={User} label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <InputField icon={Phone} label="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00A551, #008040)' }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
