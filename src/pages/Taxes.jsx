import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Receipt,
  AlertCircle,
  CheckCircle,
  Smartphone,
  CreditCard,
  X,
  Wallet,
  Calendar,
  Landmark,
  ArrowUpRight,
} from 'lucide-react';
import api from '../services/api';

const TABS = ['pending', 'history'];

const Taxes = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('pending');
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
        api.get('/taxes/history'),
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
        phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: '#00A551', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 1rem 6rem', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {t('taxes.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {t('taxes.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <AlertCircle size={20} style={{ color: '#FAD201' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FAD201' }}>
              RWF {totalPending.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{t('taxes.total_pending')}</p>
        </div>
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <CheckCircle size={20} style={{ color: '#00A551' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00A551' }}>
              RWF {totalPaid.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{t('taxes.total_paid')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '0.75rem', padding: 4, border: '1px solid var(--border-color)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '0.625rem',
              backgroundColor: activeTab === tab ? '#003DA5' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'pending' ? t('taxes.pending_taxes') : t('taxes.paid_taxes')}
            {tab === 'pending' && pendingTaxes.length > 0 && (
              <span style={{ marginLeft: 6, backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'var(--border-color)', padding: '0.1rem 0.45rem', borderRadius: '999px', fontSize: '0.7rem' }}>
                {pendingTaxes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'pending' ? (
        pendingTaxes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Receipt size={56} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>{t('taxes.no_pending')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingTaxes.map((tax) => (
              <div
                key={tax._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', margin: 0, marginBottom: 4 }}>
                      VAT Tax
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Calendar size={14} />
                      Due: {new Date(tax.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: 'rgba(250,210,1,0.12)', fontSize: '0.75rem', fontWeight: 600, color: '#FAD201', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={12} />
                    Pending
                  </div>
                </div>

                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#003DA5', margin: '0 0 1rem' }}>
                  RWF {tax.amount.toLocaleString()}
                </p>

                <button
                  onClick={() => handlePayTax(tax)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#00A551',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  <ArrowUpRight size={16} />
                  {t('taxes.pay_now')}
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        paidTaxes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle size={56} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>{t('taxes.no_history')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paidTaxes.map((tax) => (
              <div
                key={tax._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', margin: 0, marginBottom: 2 }}>
                    RWF {tax.amount.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    Paid: {new Date(tax.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: 'rgba(0,165,81,0.1)', fontSize: '0.75rem', fontWeight: 600, color: '#00A551', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={12} />
                  Paid
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {showPaymentModal && selectedTax && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              width: '100%',
              maxWidth: 420,
              borderRadius: '1.5rem 1.5rem 0 0',
              padding: '1.5rem',
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {t('taxes.pay_tax')}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-input)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, marginBottom: 4 }}>
                {t('taxes.amount_to_pay')}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00A551', margin: 0 }}>
                RWF {selectedTax.amount.toLocaleString()}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {t('taxes.payment_method')}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'mobile_money', label: 'Mobile Money', icon: Smartphone, color: '#003DA5' },
                  { key: 'card', label: 'Card Payment', icon: CreditCard, color: '#00A551' },
                  { key: 'bank', label: 'Bank Transfer', icon: Landmark, color: '#FAD201' },
                ].map((method) => {
                  const Icon = method.icon;
                  const isActive = paymentMethod === method.key;
                  return (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '0.85rem 1rem',
                        border: `2px solid ${isActive ? method.color : 'var(--border-color)'}`,
                        borderRadius: '0.875rem',
                        backgroundColor: isActive ? `${method.color}0d` : 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '0.75rem',
                        backgroundColor: isActive ? method.color : 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ flex: 1, textAlign: 'left' }}>{method.label}</span>
                      {isActive && <CheckCircle size={18} color={method.color} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'mobile_money' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {t('taxes.phone_number')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0788 XXXXXX"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.75rem',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.75rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#003DA5'; e.target.style.boxShadow = '0 0 0 3px rgba(0,61,165,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(250,210,1,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(250,210,1,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <AlertCircle size={14} style={{ color: '#FAD201', flexShrink: 0 }} />
                  <span>{t('taxes.bank_info')}</span>
                </div>
              </div>
            )}

            <button
              onClick={processPayment}
              style={{
                width: '100%',
                padding: '0.9rem',
                backgroundColor: '#00A551',
                color: '#fff',
                border: 'none',
                borderRadius: '0.875rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {t('taxes.confirm_payment')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Taxes;
