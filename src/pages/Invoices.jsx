// src/pages/Invoices.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Mail, Eye, Search } from 'lucide-react';
import api from '../services/api';

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
        responseType: 'blob'
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

  const sendInvoiceEmail = async (invoiceNumber) => {
    try {
      await api.post(`/invoices/send/${invoiceNumber}`);
      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-800">{t('invoices.title')}</h1>
        <p className="text-gray-600 text-sm mt-1">Manage and download your invoices</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by invoice number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('invoices.no_invoices')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                  invoice.status === 'issued' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {invoice.status || 'issued'}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Customer:</span> {invoice.customerInfo?.name || 'N/A'}
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  RWF {invoice.totalAmount?.toLocaleString() || 0}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadInvoice(invoice.invoiceNumber)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{t('invoices.download')}</span>
                </button>
                {invoice.customerInfo?.email && (
                  <button
                    onClick={() => sendInvoiceEmail(invoice.invoiceNumber)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{t('invoices.send_email')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;