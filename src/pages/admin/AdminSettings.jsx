import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Save, Building2, Mail, Phone, Shield, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const iconMap = {
  appName: Building2, supportEmail: Mail, supportPhone: Phone,
  maintenanceMode: AlertTriangle, maxLoginAttempts: Shield, sessionTimeout: Clock,
};

const InputIcon = ({ name }) => {
  const Icon = iconMap[name] || Building2;
  return <Icon className="w-4.5 h-4.5" />;
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => setSettings(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      setMessage('Settings saved successfully');
      setMsgType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save settings');
      setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <LoadingSpinner />;

  const fields = [
    { key: 'appName', label: 'Application Name', type: 'text' },
    { key: 'supportEmail', label: 'Support Email', type: 'email' },
    { key: 'supportPhone', label: 'Support Phone', type: 'text' },
  ];

  const numberFields = [
    { key: 'maxLoginAttempts', label: 'Max Login Attempts', min: 1 },
    { key: 'sessionTimeout', label: 'Session Timeout (minutes)', min: 5 },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>System Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Configure global application settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #00A551, #008040)' }}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
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

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>General</h2>
        </div>
        <div className="p-5 space-y-5">
          {fields.map(({ key, label, type }) => (
            <label key={key} className="block">
              <span className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{label}</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                  <InputIcon name={key} />
                </div>
                <input
                  type={type}
                  value={settings?.[key] || ''}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-input)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Security</h2>
        </div>
        <div className="p-5 space-y-5">
          {numberFields.map(({ key, label, min }) => (
            <label key={key} className="block">
              <span className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{label}</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                  <InputIcon name={key} />
                </div>
                <input
                  type="number"
                  min={min}
                  value={settings?.[key] || min}
                  onChange={(e) => update(key, parseInt(e.target.value) || min)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-input)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </label>
          ))}

          <label className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              checked={settings?.maintenanceMode || false}
              onChange={(e) => update('maintenanceMode', e.target.checked)}
              className="w-5 h-5 rounded border-2 transition-all"
              style={{ accentColor: '#00A551', borderColor: 'var(--border-color)' }}
            />
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Maintenance Mode</span>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Block all user access except admins</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
