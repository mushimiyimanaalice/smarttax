import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import {
  TrendingUp, DollarSign, ShoppingCart, Percent,
  Calendar, BarChart3,
  Receipt, PieChart, ChevronDown, FileSpreadsheet,
  File as FilePdf,
} from 'lucide-react';

const TABS = [
  { key: 'sales', label: 'Sales Report', icon: BarChart3 },
  { key: 'tax', label: 'Tax Report', icon: Receipt },
];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: salesData } = await api.get('/sales/report/monthly');
        const { data: taxData } = await api.get('/taxes/summary');
        setData({ sales: salesData, taxes: taxData });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    const rows = revenueData.map((r) => `${r._id},${r.total},${r.count}`);
    const csv = ['Period,Total,Count', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner />;

  const revenueData = Array.isArray(data?.sales) ? data.sales : [];
  const summary = data?.taxes || {};

  const tabContentStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    padding: 20,
  };

  const statCardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 14,
    padding: '16px 14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `RWF ${(summary.totalPaid || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#003DA5',
      bg: '#003DA510',
    },
    {
      label: 'Total Sales',
      value: revenueData.reduce((s, r) => s + (r.count || 0), 0).toLocaleString(),
      icon: ShoppingCart,
      color: '#00A551',
      bg: '#00A55110',
    },
    {
      label: 'Pending Tax',
      value: `RWF ${(summary.totalPending || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: '#FAD201',
      bg: '#FAD20115',
    },
    {
      label: 'Tax Compliance',
      value: summary.complianceRate ? `${summary.complianceRate.toFixed(1)}%` : '0%',
      icon: Percent,
      color: '#003DA5',
      bg: '#003DA510',
    },
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 4px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Reports & Analytics
        </h1>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }} ref={dateRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                minHeight: 40,
                padding: '0 14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Calendar size={16} color="#003DA5" />
              {dateRange.from || 'Date Range'}
              <ChevronDown size={14} />
            </button>
            {showDatePicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  minWidth: 240,
                }}
              >
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  From
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: 4,
                      padding: '8px 10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </label>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  To
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      marginTop: 4,
                      padding: '8px 10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </label>
                <button
                  onClick={() => { setShowDatePicker(false); }}
                  style={{
                    width: '100%',
                    minHeight: 38,
                    background: 'linear-gradient(135deg, #003DA5, #00A551)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <button
            onClick={exportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 40,
              padding: '0 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} color="#00A551" />
            CSV
          </button>
          <button
            onClick={exportPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 40,
              padding: '0 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <FilePdf size={16} color="#dc2626" />
            PDF
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={statCardStyle}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                {label}
              </span>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={16} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          background: '#003DA508',
          borderRadius: 12,
          padding: 4,
          marginBottom: 16,
        }}
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              minHeight: 42,
              border: 'none',
              borderRadius: 10,
              background: activeTab === key ? '#fff' : 'transparent',
              color: activeTab === key ? '#003DA5' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && (
        <div style={tabContentStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <TrendingUp size={18} color="#00A551" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Revenue Trend
            </h2>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#00A551" strokeWidth={2} dot={{ fill: '#003DA5', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div style={tabContentStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <PieChart size={18} color="#003DA5" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Tax Breakdown
            </h2>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Paid', amount: summary.totalPaid || 0 },
                  { name: 'Pending', amount: summary.totalPending || 0 },
                  { name: 'Overdue', amount: summary.totalOverdue || 0 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  <Cell fill="#00A551" />
                  <Cell fill="#FAD201" />
                  <Cell fill="#dc2626" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
