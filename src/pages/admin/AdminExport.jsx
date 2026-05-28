import { useState } from 'react';
import api from '../../services/api';
import {
  Download, FileSpreadsheet, FileText, FileBarChart, Eye, X,
  BarChart3, PieChart, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const COLORS = ['#003DA5', '#00A551', '#FAD201', '#0088CC', '#66BB6A'];

const chartComponents = {
  'tax-collection': {
    icon: FileBarChart,
    preview: (data) => (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="month" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="amount" fill="#00A551" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
  },
  compliance: {
    icon: FileSpreadsheet,
    preview: () => (
      <ResponsiveContainer width="100%" height={200}>
        <RePieChart>
          <Pie data={[{ name: 'Compliant', value: 75 }, { name: 'Pending', value: 25 }]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" isAnimationActive>
            {[{ name: 'Compliant' }, { name: 'Pending' }].map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    ),
  },
  businesses: {
    icon: FileText,
    preview: () => (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={[{ type: 'Active', count: 45 }, { type: 'Pending', count: 12 }, { type: 'Suspended', count: 3 }]}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="type" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#003DA5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
  },
  payments: {
    icon: FileSpreadsheet,
    preview: () => (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={[{ m: 'Jan', v: 400 }, { m: 'Feb', v: 300 }, { m: 'Mar', v: 600 }, { m: 'Apr', v: 500 }]}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="m" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="v" stroke="#FAD201" strokeWidth={2} dot={{ fill: '#FAD201', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
  'audit-logs': { icon: FileText, preview: null },
  inactivity: { icon: FileBarChart, preview: null },
};

const AdminExport = () => {
  const [exporting, setExporting] = useState(false);
  const [preview, setPreview] = useState(null);

  const exportReport = async (type, format) => {
    setExporting(true);
    try {
      const { data } = await api.get('/admin/export', {
        params: { type, format },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `smarttax-${type}-${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const reports = [
    { type: 'tax-collection', label: 'Tax Collection Report', desc: 'Monthly tax revenue overview' },
    { type: 'compliance', label: 'Compliance Report', desc: 'Business compliance status' },
    { type: 'businesses', label: 'Businesses Report', desc: 'All registered businesses' },
    { type: 'payments', label: 'Payment Transactions', desc: 'Payment history & trends' },
    { type: 'audit-logs', label: 'Audit Logs', desc: 'System activity log' },
    { type: 'inactivity', label: 'Inactivity Report', desc: 'Inactive business monitoring' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Export Reports</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Preview and download reports in CSV or PDF format</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const cfg = chartComponents[report.type];
          const Icon = cfg?.icon || FileText;
          return (
            <div
              key={report.type}
              className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl" style={{ background: 'rgba(0,165,81,0.1)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#00A551' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{report.label}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{report.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {cfg?.preview && (
                    <button
                      onClick={() => setPreview(preview?.type === report.type ? null : { type: report.type, ...cfg })}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                        preview?.type === report.type ? 'border-green-500' : ''
                      }`}
                      style={{
                        background: preview?.type === report.type ? 'rgba(0,165,81,0.08)' : 'var(--bg-input)',
                        borderColor: preview?.type === report.type ? '#00A551' : 'var(--border-color)',
                        color: preview?.type === report.type ? '#00A551' : 'var(--text-secondary)',
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={() => exportReport(report.type, 'csv')}
                    disabled={exporting}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(0,165,81,0.08)',
                      borderColor: 'rgba(0,165,81,0.2)',
                      color: '#00A551',
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                  <button
                    onClick={() => exportReport(report.type, 'pdf')}
                    disabled={exporting}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(0,61,165,0.08)',
                      borderColor: 'rgba(0,61,165,0.2)',
                      color: '#003DA5',
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </div>
              </div>
              {preview?.type === report.type && (
                <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" style={{ color: '#00A551' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Preview</span>
                    </div>
                    <button
                      onClick={() => setPreview(null)}
                      className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {cfg?.preview && cfg.preview([])}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminExport;
