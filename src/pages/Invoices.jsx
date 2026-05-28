import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Search, CheckCircle, Clock, AlertTriangle, Eye, ChevronDown } from 'lucide-react';
import api from '../services/api';

const STATUS_CONFIG = {
  paid: { label: 'Paid', color: '#00A551', bg: 'rgba(0,165,81,0.1)', icon: CheckCircle },
  pending: { label: 'Pending', color: '#FAD201', bg: 'rgba(250,210,1,0.12)', icon: Clock },
  issued: { label: 'Pending', color: '#FAD201', bg: 'rgba(250,210,1,0.12)', icon: Clock },
  overdue: { label: 'Overdue', color: '#DC2626', bg: 'rgba(220,38,38,0.1)', icon: AlertTriangle },
};

const Invoices = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/download/${invoiceNumber}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return inv.invoiceNumber?.toLowerCase().includes(term);
  });

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
          {t('invoices.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {t('invoices.subtitle')}
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder={t('invoices.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '1rem',
            color: 'var(--text-primary)',
            fontSize: '0.9375rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#003DA5'; e.target.style.boxShadow = '0 0 0 3px rgba(0,61,165,0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <FileText size={56} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            {searchTerm ? t('invoices.no_results') : t('invoices.no_invoices')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredInvoices.map((invoice) => {
            const statusKey = invoice.status || 'issued';
            const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.issued;
            const StatusIcon = cfg.icon;

            return (
              <div
                key={invoice._id}
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
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                      {invoice.invoiceNumber}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4, marginBottom: 0 }}>
                      {new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.35rem 0.7rem', borderRadius: '999px', backgroundColor: cfg.bg, fontSize: '0.75rem', fontWeight: 600, color: cfg.color, whiteSpace: 'nowrap' }}>
                    <StatusIcon size={14} />
                    {cfg.label}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, marginBottom: 2 }}>
                      {invoice.customerInfo?.name || 'N/A'}
                    </p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#00A551', margin: 0 }}>
                      RWF {invoice.totalAmount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadInvoice(invoice.invoiceNumber)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#003DA5',
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
                  <Download size={16} />
                  {t('invoices.download')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Invoices;
