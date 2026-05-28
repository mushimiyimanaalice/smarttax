import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingCart, FileText, Receipt } from 'lucide-react';

const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'dashboard' },
    { path: '/products', icon: Package, label: 'products' },
    { path: '/sales', icon: ShoppingCart, label: 'sales' },
    { path: '/invoices', icon: FileText, label: 'invoices' },
    { path: '/taxes', icon: Receipt, label: 'taxes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 transition-colors min-h-[44px] min-w-[44px] ${
                  isActive ? '' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#00A551' : 'var(--text-secondary)',
              })}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{t(`bottom_nav.${item.label}`)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
