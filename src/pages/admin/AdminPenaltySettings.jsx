import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Save } from 'lucide-react';

const AdminPenaltySettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admin/penalty-settings');
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
      await api.put('/admin/penalty-settings', settings);
      setMessage('Penalty settings saved');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Penalty Settings</h1>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
          <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Late Payment Penalty (% per day)</span>
          <input type="number" step="0.01" value={settings?.latePenaltyPerDay ?? 0.05} onChange={(e) => update('latePenaltyPerDay', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Max Penalty (%)</span>
          <input type="number" step="0.1" value={settings?.maxPenalty ?? 25} onChange={(e) => update('maxPenalty', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Grace Period (days)</span>
          <input type="number" value={settings?.gracePeriodDays ?? 7} onChange={(e) => update('gracePeriodDays', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Interest Rate (% per month)</span>
          <input type="number" step="0.1" value={settings?.interestRate ?? 1.5} onChange={(e) => update('interestRate', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
      </div>
    </div>
  );
};

export default AdminPenaltySettings;
