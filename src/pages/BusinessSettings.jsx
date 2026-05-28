import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Save, Building2 } from 'lucide-react';

const BusinessSettings = () => {
  const { user } = useAuthStore();
  const { activeBusiness } = useBusinessStore();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeBusiness) {
      setForm({
        name: activeBusiness.name || '',
        contactEmail: activeBusiness.contactEmail || '',
        contactPhone: activeBusiness.contactPhone || '',
        businessType: activeBusiness.businessType || 'individual',
        address: { ...activeBusiness.address },
      });
    }
  }, [activeBusiness]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!activeBusiness) return;
    setSaving(true);
    try {
      await api.put(`/businesses/${activeBusiness._id}`, form);
      setMessage('Business updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (!activeBusiness) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-theme-primary">Business Settings</h1>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-theme-card rounded-xl border border-theme p-4">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b">
          <Building2 className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="font-semibold text-theme-primary">{activeBusiness.name}</h2>
            <p className="text-xs text-slate-500">TIN: {activeBusiness.taxIdentificationNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Business Name</span>
            <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Contact Email</span>
            <input type="email" value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="mt-1 w-full px-3 py-2 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Contact Phone</span>
            <input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="mt-1 w-full px-3 py-2 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessSettings;
