// src/components/Layout/BottomNav.jsx
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 transition-colors min-h-[44px] min-w-[44px] ${
                isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{t(`bottom_nav.${item.label}`)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;