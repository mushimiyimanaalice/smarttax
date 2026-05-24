import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { User, Save, LogOut, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Profile Settings</h1>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4 mb-4 pb-3 border-b">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{user?.fullName}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Full Name</span>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Phone Number</span>
            <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <button onClick={handleLogout} className="w-full py-3 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};

export default Profile;
