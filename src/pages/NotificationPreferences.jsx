import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Save, Bell, BellRing, Volume2, Smartphone } from 'lucide-react';

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    inactivityReminders: true,
    taxReminders: true,
    businessUpdates: true,
    marketingEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/notifications/preferences');
        setPrefs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/notifications/preferences', prefs);
      setMessage('Preferences updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) return <LoadingSpinner />;

  const settings = [
    { key: 'pushEnabled', label: 'Push Notifications', icon: Bell },
    { key: 'emailEnabled', label: 'Email Notifications', icon: BellRing },
    { key: 'smsEnabled', label: 'SMS Notifications', icon: Smartphone },
    { key: 'inactivityReminders', label: 'Inactivity Reminders', icon: Volume2 },
    { key: 'taxReminders', label: 'Tax Payment Reminders', icon: Bell },
    { key: 'businessUpdates', label: 'Business Updates', icon: BellRing },
    { key: 'marketingEnabled', label: 'Marketing & Promotions', icon: Volume2 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-theme-primary">Notification Preferences</h1>
        <button onClick={handleSave} disabled={saving} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-1">
          <Save className="w-3 h-3" />{saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-theme-card rounded-xl border border-theme divide-y divide-slate-100">
        {settings.map((s) => {
          const Icon = s.icon;
          return (
            <label key={s.key} className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-700">{s.label}</span>
              </div>
              <input
                type="checkbox"
                checked={prefs[s.key]}
                onChange={() => toggle(s.key)}
                className="w-5 h-5 text-green-600 rounded border-slate-300 focus:ring-green-500"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPreferences;
