import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Save } from 'lucide-react';

const AdminTaxSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admin/tax-settings');
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
      await api.put('/admin/tax-settings', settings);
      setMessage('Tax settings saved');
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
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tax Settings</h1>
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
          <span className="text-sm font-medium text-slate-700">VAT Rate (%)</span>
          <input type="number" step="0.1" value={settings?.vatRate ?? 18} onChange={(e) => update('vatRate', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Reduced VAT Rate (%)</span>
          <input type="number" step="0.1" value={settings?.reducedVatRate ?? 8} onChange={(e) => update('reducedVatRate', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tax Due Day of Month</span>
          <input type="number" min={1} max={28} value={settings?.taxDueDay ?? 15} onChange={(e) => update('taxDueDay', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tax Filing Period (months)</span>
          <input type="number" min={1} max={12} value={settings?.filingPeriod ?? 1} onChange={(e) => update('filingPeriod', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </label>
      </div>
    </div>
  );
};

export default AdminTaxSettings;
