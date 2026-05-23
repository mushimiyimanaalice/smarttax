// src/pages/Taxes.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, AlertCircle, CheckCircle, Smartphone, X, CreditCard } from 'lucide-react';
import api from '../services/api';

const Taxes = () => {
  const { t } = useTranslation();
  const [pendingTaxes, setPendingTaxes] = useState([]);
  const [paidTaxes, setPaidTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTaxData();
  }, []);

  const fetchTaxData = async () => {
    try {
      const [pendingRes, paidRes] = await Promise.all([
        api.get('/taxes/pending'),
        api.get('/taxes/history')
      ]);
      setPendingTaxes(pendingRes.data);
      setPaidTaxes(paidRes.data);
    } catch (error) {
      console.error('Error fetching tax data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayTax = (tax) => {
    setSelectedTax(tax);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedTax) return;

    try {
      const response = await api.post(`/taxes/pay/${selectedTax._id}`, {
        paymentMethod,
        phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined
      });

      if (response.data) {
        alert(t('taxes.payment_successful'));
        setShowPaymentModal(false);
        fetchTaxData();
        setSelectedTax(null);
        setPhoneNumber('');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t('taxes.payment_failed'));
    }
  };

  const totalPending = pendingTaxes.reduce((sum, tax) => sum + tax.amount, 0);
  const totalPaid = paidTaxes.reduce((sum, tax) => sum + tax.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="py-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('taxes.title')}</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your tax obligations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-800">RWF {totalPending.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600">{t('taxes.total_pending')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">RWF {totalPaid.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600">{t('taxes.total_paid')}</p>
        </div>
      </div>

      {/* Pending Taxes */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('taxes.pending_taxes')}</h2>
        {pendingTaxes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No pending taxes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTaxes.map((tax) => (
              <div key={tax._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">VAT Tax</p>
                    <p className="text-xs text-gray-500">Due: {new Date(tax.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">RWF {tax.amount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handlePayTax(tax)}
                  className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  {t('taxes.pay_now')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('taxes.paid_taxes')}</h2>
        {paidTaxes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No payment history</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paidTaxes.slice(0, 5).map((tax) => (
              <div key={tax._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">RWF {tax.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Paid: {new Date(tax.paidAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTax && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl animate-slide-up p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Pay Tax</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-2xl font-bold text-green-600">RWF {selectedTax.amount.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                    paymentMethod === 'mobile_money' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span>Mobile Money</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                    paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Card</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'mobile_money' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0788XXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            <button
              onClick={processPayment}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taxes;