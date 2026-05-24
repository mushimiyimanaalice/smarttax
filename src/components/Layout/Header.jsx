import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Bell, HelpCircle, BarChart3, ShoppingCart, Package, FileText, Landmark } from 'lucide-react';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import NotificationBell from '../Notifications/NotificationBell';

const Header = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: Landmark, label: 'Taxes', path: '/taxes' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Business Settings', path: '/business-settings' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="bg-green-600 text-white sticky top-0 z-50 shadow-md">
        <div className="px-4 mx-auto max-w-md flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">ST</span>
            </div>
            <h1 className="text-lg font-semibold">SmartTax</h1>
          </div>

          <div className="flex items-center gap-1">
            <NotificationBell userId={user?.id || user?._id} token={token} />
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-14 right-0 w-72 bg-white rounded-lg shadow-lg m-2 z-50 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
