import { useState } from 'react';
import api from '../../services/api';
import { Download, FileSpreadsheet, FileText, FileBarChart } from 'lucide-react';

const AdminExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportReport = async (type, format) => {
    setExporting(true);
    try {
      const { data } = await api.get(`/admin/export`, {
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
    { type: 'tax-collection', label: 'Tax Collection Report', icon: FileBarChart },
    { type: 'compliance', label: 'Compliance Report', icon: FileSpreadsheet },
    { type: 'businesses', label: 'Businesses Report', icon: FileText },
    { type: 'payments', label: 'Payment Transactions', icon: FileSpreadsheet },
    { type: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { type: 'inactivity', label: 'Inactivity Report', icon: FileBarChart },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Export Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.type} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{report.label}</h3>
                  <p className="text-xs text-slate-500">Export as CSV or PDF</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportReport(report.type, 'csv')}
                  disabled={exporting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 transition"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => exportReport(report.type, 'pdf')}
                  disabled={exporting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminExport;
