import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Package, Receipt, AlertCircle, DollarSign, ShoppingCart, FileText, ArrowRight } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    } catch (error) { console.error('Error fetching dashboard data:', error); }
  };

  const todaySales = getTodaySales();
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

  const StatCard = ({ icon: Icon, title, value, color, trend, onClick }) => (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 border transition-all duration-200 hover:shadow-lg active:scale-[0.98] cursor-pointer"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: color }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <h3 className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
      {trend && <p className="text-xs mt-1 font-medium" style={{ color: '#00A551' }}>{trend}</p>}
    </div>
  );

  return (
    <div className="py-4 space-y-5">
      {/* Welcome Section */}
      <div className="rounded-2xl p-5 border relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20" style={{ background: '#FAD201' }} />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10 bg-white" />
        <h1 className="text-xl font-bold text-white">
          {t('dashboard.welcome')}, {user?.fullName?.split(' ')[0]}
        </h1>
        <p className="text-white/80 text-sm mt-1">{t('dashboard.today_summary')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={DollarSign}
          title={t('dashboard.total_revenue')}
          value={`RWF ${stats.totalRevenue.toLocaleString()}`}
          color="linear-gradient(135deg, #00A551, #008040)"
          trend={`+RWF ${todayRevenue.toLocaleString()} today`}
          onClick={() => navigate('/sales')}
        />
        <StatCard
          icon={ShoppingCart}
          title={t('dashboard.total_sales')}
          value={stats.totalSales}
          color="linear-gradient(135deg, #003DA5, #002A7A)"
          onClick={() => navigate('/sales')}
        />
        <StatCard
          icon={Package}
          title={t('dashboard.products')}
          value={stats.totalProducts}
          color="linear-gradient(135deg, #FAD201, #E6BD00)"
          onClick={() => navigate('/products')}
        />
        <StatCard
          icon={AlertCircle}
          title={t('dashboard.pending_tax')}
          value={`RWF ${stats.pendingTax.toLocaleString()}`}
          color="linear-gradient(135deg, #EF4444, #DC2626)"
          trend={t('dashboard.due_soon')}
          onClick={() => navigate('/pending-taxes')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => navigate('/sales')} className="rounded-2xl p-4 border text-center transition-all duration-200 hover:shadow-lg active:scale-[0.98]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <ShoppingCart className="w-6 h-6 mx-auto mb-1.5" style={{ color: '#00A551' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>New Sale</span>
        </button>
        <button onClick={() => navigate('/products')} className="rounded-2xl p-4 border text-center transition-all duration-200 hover:shadow-lg active:scale-[0.98]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Package className="w-6 h-6 mx-auto mb-1.5" style={{ color: '#003DA5' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Add Product</span>
        </button>
        <button onClick={() => navigate('/taxes')} className="rounded-2xl p-4 border text-center transition-all duration-200 hover:shadow-lg active:scale-[0.98]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Receipt className="w-6 h-6 mx-auto mb-1.5" style={{ color: '#FAD201' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Pay Tax</span>
        </button>
      </div>

      {/* Recent Sales */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('dashboard.recent_sales')}</h3>
          <button onClick={() => navigate('/sales')} className="text-sm flex items-center gap-1 font-medium" style={{ color: '#00A551' }}>
            {t('dashboard.view_all')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {recentSales.length > 0 ? (
            recentSales.map((sale) => (
              <div key={sale._id || sale.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{sale.invoiceNumber || 'INV-001'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>RWF {(sale.totalAmount || 0).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    sale.paymentStatus === 'paid' ? 'text-green-700' : 'text-yellow-700'
                  }`} style={{
                    background: sale.paymentStatus === 'paid' ? 'rgba(0,165,81,0.1)' : 'rgba(250,210,1,0.15)'
                  }}>
                    {sale.paymentStatus === 'paid' ? t('common.paid') : t('common.pending_tax')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              <ShoppingCart className="w-12 h-12 mx-auto mb-2" style={{ opacity: 0.2 }} />
              <p>{t('dashboard.no_sales')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
