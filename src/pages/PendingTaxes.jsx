import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Clock, AlertCircle, Smartphone } from 'lucide-react';

const PendingTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/taxes/pending');
        setTaxes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPending = taxes.reduce((sum, t) => sum + (t.amount || 0), 0);

  const handlePay = async (taxId) => {
    try {
      await api.post('/taxes/pay/' + taxId, { paymentMethod: 'mobile_money', phoneNumber });
      setShowPayModal(null);
      setPhoneNumber('');
      const { data } = await api.get('/taxes/pending');
      setTaxes(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-theme-primary">Pending Taxes</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-amber-800">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Total Pending: RWF {totalPending.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        {taxes.map((tax) => (
          <div key={tax._id} className="bg-theme-card rounded-xl border border-theme p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-theme-primary capitalize">{tax.type} Tax</p>
                <p className="text-xs text-slate-500">Due: {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-theme-primary">RWF {tax.amount?.toLocaleString()}</p>
                <button
                  onClick={() => setShowPayModal(tax._id)}
                  className="mt-1 inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                >
                  Pay Now
                </button>
              </div>
            </div>
            {tax.penaltyAmount > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                Penalty: RWF {tax.penaltyAmount.toLocaleString()}
              </div>
            )}
          </div>
        ))}
        {taxes.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No pending taxes</p>
          </div>
        )}
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-theme-card rounded-xl w-full max-w-sm p-5">
            <h2 className="text-lg font-semibold text-theme-primary mb-4">Pay with Mobile Money</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700">MTN / Airtel Money</span>
              </div>
              <input
                type="tel"
                placeholder="Phone Number (e.g. 078xxxxxxx)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2.5 border border-theme rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowPayModal(null)} className="flex-1 py-2.5 text-sm font-medium text-theme-secondary bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
                <button onClick={() => handlePay(showPayModal)} disabled={!phoneNumber} className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingTaxes;
