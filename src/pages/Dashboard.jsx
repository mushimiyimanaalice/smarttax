import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Package, Receipt, AlertCircle, DollarSign, ShoppingCart, FileText, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { sales, fetchSales, getTodaySales, getTotalRevenue, getTotalTax } = useSalesStore();
  const { products, fetchProducts } = useProductStore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    pendingTax: 0,
    totalSales: 0
  });
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setStats({
      totalRevenue: getTotalRevenue(),
      totalProducts: products.length,
      pendingTax: getTotalTax(),
      totalSales: sales.length
    });
    setRecentSales(sales.slice(0, 5));
  }, [sales, products]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/businesses/my-business/stats');
      if (response.data) {
        setStats(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
    </div>
  );

  const todaySales = getTodaySales();
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

  return (
    <div className="py-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {t('dashboard.welcome')}, {user?.fullName?.split(' ')[0]}
        </h1>
        <p className="text-gray-600 text-sm mt-1">{t('dashboard.today_summary')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          title={t('dashboard.total_revenue')}
          value={`RWF ${stats.totalRevenue.toLocaleString()}`}
          color="bg-green-500"
          trend={`+${todayRevenue.toLocaleString()} today`}
        />
        <StatCard
          icon={ShoppingCart}
          title={t('dashboard.total_sales')}
          value={stats.totalSales}
          color="bg-blue-500"
        />
        <StatCard
          icon={Package}
          title={t('dashboard.products')}
          value={stats.totalProducts}
          color="bg-purple-500"
        />
        <StatCard
          icon={AlertCircle}
          title={t('dashboard.pending_tax')}
          value={`RWF ${stats.pendingTax.toLocaleString()}`}
          color="bg-red-500"
          trend={t('dashboard.due_soon')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button className="bg-white p-3 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <span className="text-xs text-gray-600">New Sale</span>
        </button>
        <button className="bg-white p-3 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <Package className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <span className="text-xs text-gray-600">Add Product</span>
        </button>
        <button className="bg-white p-3 rounded-xl shadow-sm text-center hover:shadow-md transition">
          <Receipt className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <span className="text-xs text-gray-600">Pay Tax</span>
        </button>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{t('dashboard.recent_sales')}</h3>
          <button className="text-green-600 text-sm flex items-center gap-1">
            {t('dashboard.view_all')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y">
          {recentSales.length > 0 ? (
            recentSales.map((sale) => (
              <div key={sale._id || sale.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{sale.invoiceNumber || 'INV-001'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">RWF {(sale.totalAmount || 0).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {sale.paymentStatus === 'paid' ? t('common.paid') : t('common.pending_tax')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>{t('dashboard.no_sales')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;