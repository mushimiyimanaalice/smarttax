import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admin/settings');
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">System Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-4">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Application Name</span>
            <input value={settings?.appName || ''} onChange={(e) => update('appName', e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Support Email</span>
            <input type="email" value={settings?.supportEmail || ''} onChange={(e) => update('supportEmail', e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Support Phone</span>
            <input value={settings?.supportPhone || ''} onChange={(e) => update('supportPhone', e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings?.maintenanceMode || false} onChange={(e) => update('maintenanceMode', e.target.checked)} className="w-4 h-4 text-green-600 rounded border-slate-300" />
            <span className="text-sm font-medium text-slate-700">Maintenance Mode</span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Max Login Attempts</span>
            <input type="number" value={settings?.maxLoginAttempts || 5} onChange={(e) => update('maxLoginAttempts', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Session Timeout (minutes)</span>
            <input type="number" value={settings?.sessionTimeout || 60} onChange={(e) => update('sessionTimeout', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
