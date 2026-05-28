import { useState, useEffect } from 'react';
import api from '../../services/api';

const REASONS = [
  { value: 'sickness', label: 'Sickness' },
  { value: 'no_customers', label: 'No customers' },
  { value: 'travel', label: 'Travel' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'stock_finished', label: 'Stock finished' },
  { value: 'shop_closed', label: 'Shop closed' },
  { value: 'other', label: 'Other' },
];

const InactivityModal = () => {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState('no_customers');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/activity/inactivity/pending')
      .then((res) => setShow(!!res.data.needsExplanation))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/activity/inactivity/report', { reason, description, note });
      setShow(false);
      alert('Thank you. Your explanation was sent to the sector admin.');
    } catch {
      alert('Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[55] bg-black/50 flex items-end sm:items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="bg-theme-card w-full max-w-md rounded-2xl p-6 shadow-xl"
      >
        <h2 className="text-lg font-bold text-theme-primary mb-2">Explain today&apos;s inactivity</h2>
        <p className="text-sm text-theme-secondary mb-4">
          No sales activity was detected today. Please tell us why your business was inactive.
        </p>

        <label className="block text-sm font-medium mb-1">Reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg"
          required
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-lg h-24"
          required
        />

        <label className="block text-sm font-medium mb-1">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-lg"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Submit report'}
        </button>
      </form>
    </div>
  );
};

export default InactivityModal;
