import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard,
  Smartphone, DollarSign, X, Package, User, Phone, FileText,
  Hash, CheckCircle, Receipt
} from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { computeCartLine } from '../utils/tax';

const accentBlue = '#003DA5';
const accentGreen = '#00A551';
const accentYellow = '#FAD201';

const btnBase = {
  minHeight: '44px',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'background 0.2s, transform 0.1s',
  border: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px 10px 40px',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  minHeight: '44px',
  boxSizing: 'border-box',
};

const iconInInput = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: accentBlue,
  pointerEvents: 'none',
  display: 'flex',
};

const Sales = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createSale } = useSalesStore();
  const { products, fetchProducts } = useProductStore();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const invoiceNumber = useMemo(() => {
    const date = new Date();
    const ds = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV-${ds}-${rand}`;
  }, [cart.length === 0]);

  const addToCart = (product) => {
    const taxRate = product.taxRate || 18;
    const existing = cart.find((i) => i.productId === product._id);
    if (existing) {
      const qty = existing.quantity + 1;
      const line = computeCartLine(existing.price, qty, taxRate);
      setCart(cart.map((i) => (i.productId === product._id ? { ...i, quantity: qty, ...line } : i)));
    } else {
      const line = computeCartLine(product.price, 1, taxRate);
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, taxRate, quantity: 1, ...line }]);
    }
  };

  const updateQty = (idx, delta) => {
    const nc = [...cart];
    const item = nc[idx];
    const nq = item.quantity + delta;
    if (nq <= 0) {
      nc.splice(idx, 1);
    } else {
      const line = computeCartLine(item.price, nq, item.taxRate);
      nc[idx] = { ...item, quantity: nq, ...line };
    }
    setCart(nc);
  };

  const removeItem = (idx) => setCart(cart.filter((_, i) => i !== idx));

  const totals = useMemo(() => ({
    subtotal: cart.reduce((s, i) => s + i.subtotal, 0),
    tax: cart.reduce((s, i) => s + i.taxAmount, 0),
    total: cart.reduce((s, i) => s + i.total, 0),
  }), [cart]);

  const handleCheckout = async () => {
    const saleData = {
      invoiceNumber,
      items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      paymentMethod: selectedPayment,
      customerInfo,
      subtotal: totals.subtotal,
      taxAmount: totals.tax,
      totalAmount: totals.total,
    };
    const result = await createSale(saleData);
    if (result.success) {
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      setShowPaymentModal(false);
      alert(result.offline ? t('sales.saved_offline') : t('sales.sale_completed'));
    } else {
      alert(t('sales.error_processing'));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '0 16px 180px', maxWidth: '768px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 0' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {t('sales.title')}
        </h1>

        {/* Invoice Number Badge */}
        {cart.length > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#EEF2FF',
              fontSize: '12px',
              fontWeight: 500,
              color: accentBlue,
            }}
          >
            <FileText size={13} />
            {invoiceNumber}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={iconInInput}><Search size={18} /></div>
        <input
          type="text"
          placeholder={t('sales.search_products')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {filteredProducts.map((product) => (
          <button
            key={product._id}
            onClick={() => addToCart(product)}
            style={{
              ...btnBase,
              flexDirection: 'column',
              alignItems: 'stretch',
              textAlign: 'left',
              padding: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.1s',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentBlue;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,61,165,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
            }}
          >
            {/* Top accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${accentBlue}, ${accentGreen})`,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: accentGreen,
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </h3>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: accentGreen, margin: 0 }}>
              RWF {Number(product.price).toLocaleString()}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              {t('sales.price_includes_vat')}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Package size={11} />
                {t('products.stock')}: {product.quantity}
              </span>
              <Plus size={16} color={accentBlue} style={{ flexShrink: 0 }} />
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
            <Package size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Cart Bottom Sheet */}
      {cart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            zIndex: 40,
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Cart header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px 12px',
              borderBottom: '1px solid var(--border-color)',
              flexShrink: 0,
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color={accentBlue} />
              {t('sales.cart')}
              <span
                style={{
                  background: accentBlue,
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {cart.length}
              </span>
            </h3>
            <button
              onClick={() => setCart([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>

          {/* Cart items */}
          <div style={{ overflowY: 'auto', padding: '8px 20px', flex: 1 }}>
            {cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    RWF {Number(item.price).toLocaleString()} × {item.quantity}
                  </p>
                </div>

                {/* Qty Picker */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'var(--bg-input)',
                    borderRadius: '10px',
                    padding: '2px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <button
                    onClick={() => updateQty(idx, -1)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: 'none',
                      background: item.quantity <= 1 ? '#FEE2E2' : '#E8F5E9',
                      color: item.quantity <= 1 ? '#DC2626' : accentGreen,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.quantity <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span
                    style={{
                      minWidth: '28px',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(idx, 1)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#E8F5E9',
                      color: accentGreen,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: accentGreen, margin: 0 }}>
                    RWF {Number(item.total).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginTop: '2px',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Checkout */}
          <div
            style={{
              padding: '12px 20px 16px',
              borderTop: '1px solid var(--border-color)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>{t('sales.subtotal')}</span>
              <span style={{ fontWeight: 600 }}>RWF {Number(totals.subtotal).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>{t('sales.vat')}</span>
              <span style={{ fontWeight: 600 }}>RWF {Number(totals.tax).toLocaleString()}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                paddingTop: '8px',
                marginTop: '8px',
                borderTop: '2px solid',
                borderImage: `linear-gradient(90deg, ${accentBlue}, ${accentGreen}) 1`,
              }}
            >
              <span>{t('sales.total')}</span>
              <span style={{ color: accentGreen }}>RWF {Number(totals.total).toLocaleString()}</span>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              style={{
                ...btnBase,
                width: '100%',
                background: `linear-gradient(135deg, ${accentBlue}, ${accentGreen})`,
                color: '#fff',
                padding: '14px',
                marginTop: '14px',
                boxShadow: '0 4px 14px rgba(0,61,165,0.25)',
                fontSize: '16px',
              }}
            >
              <CheckCircle size={20} />
              {t('sales.complete_sale')}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 60,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px 24px 0 0',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={20} color={accentBlue} />
                {t('sales.payment_method')}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Payment Methods */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { key: 'cash', icon: DollarSign, color: accentGreen, label: 'Cash' },
                { key: 'mobile_money', icon: Smartphone, color: accentBlue, label: 'Mobile Money' },
                { key: 'card', icon: CreditCard, color: accentYellow, label: 'Card' },
              ].map(({ key, icon: Icon, color, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedPayment(key)}
                  style={{
                    ...btnBase,
                    justifyContent: 'flex-start',
                    padding: '14px 16px',
                    background: selectedPayment === key ? '#EEF2FF' : 'var(--bg-input)',
                    border: selectedPayment === key
                      ? `2px solid ${accentBlue}`
                      : '2px solid var(--border-color)',
                    borderRadius: '14px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: selectedPayment === key ? accentBlue : 'var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={selectedPayment === key ? '#fff' : 'var(--text-secondary)'} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{label}</p>
                  </div>
                  {selectedPayment === key && (
                    <CheckCircle size={18} color={accentBlue} />
                  )}
                </button>
              ))}
            </div>

            {/* Customer Info */}
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              Customer Information
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={iconInInput}><User size={16} /></div>
                <input
                  type="text"
                  placeholder="Customer name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconInInput}><Phone size={16} /></div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconInInput}><Hash size={16} /></div>
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Invoice Preview */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '20px',
                border: '1px dashed var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Invoice</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>RWF {Number(totals.subtotal).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>VAT</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>RWF {Number(totals.tax).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '6px' }}>
                <span>Total Due</span>
                <span style={{ color: accentGreen }}>RWF {Number(totals.total).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                ...btnBase,
                width: '100%',
                background: `linear-gradient(135deg, ${accentBlue}, ${accentGreen})`,
                color: '#fff',
                padding: '16px',
                fontSize: '16px',
                boxShadow: '0 4px 14px rgba(0,61,165,0.25)',
              }}
            >
              <CheckCircle size={20} />
              Confirm & Pay RWF {Number(totals.total).toLocaleString()}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        input:focus {
          border-color: ${accentBlue} !important;
          box-shadow: 0 0 0 3px rgba(0,61,165,0.12) !important;
        }
        button:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
};

export default Sales;
