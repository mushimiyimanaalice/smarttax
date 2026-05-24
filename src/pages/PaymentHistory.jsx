import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Wallet, CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/payments/transactions');
        setPayments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATUS_ICONS = {
    completed: CheckCircle,
    pending: Clock,
    failed: XCircle,
    processing: Clock,
  };

  const STATUS_COLORS = {
    completed: 'text-green-600 bg-green-50',
    pending: 'text-amber-600 bg-amber-50',
    failed: 'text-red-600 bg-red-50',
    processing: 'text-blue-600 bg-blue-50',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-800">Payment History</h1>

      <div className="space-y-2">
        {payments.map((p) => {
          const StatusIcon = STATUS_ICONS[p.status] || Clock;
          return (
            <div key={p._id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${STATUS_COLORS[p.status] || 'bg-slate-50 text-slate-600'}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 capitalize">
                      {p.paymentMethod?.replace('_', ' ')} Payment
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                      {p.provider && ` · ${p.provider.toUpperCase()}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">RWF {p.amount?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === 'completed' ? 'bg-green-100 text-green-700' :
                    p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    p.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{p.status}</span>
                </div>
              </div>
            </div>
          );
        })}
        {payments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Wallet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No payment history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
