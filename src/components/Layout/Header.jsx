import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { Menu, X, User, LogOut, Settings, Bell, HelpCircle, BarChart3, ShoppingCart, Package, FileText, Landmark, Sun, Moon } from 'lucide-react';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import NotificationBell from '../Notifications/NotificationBell';

const Header = () => {
  const { user, token, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
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
      <header className="sticky top-0 z-50 shadow-md" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
        <div className="px-4 mx-auto max-w-md flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg" style={{ background: 'linear-gradient(135deg, #FAD201, #00A551)' }}>
              ST
            </div>
            <h1 className="text-lg font-semibold text-white">SmartTax</h1>
          </div>

          <div className="flex items-center gap-0.5">
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-all duration-200 hover:bg-white/20 active:scale-90 text-white" title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
            <NotificationBell userId={user?.id || user?._id} token={token} />
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-14 right-0 w-72 rounded-2xl shadow-2xl m-2 z-50 max-h-[80vh] overflow-y-auto border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.fullName}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,165,81,0.08)'; e.currentTarget.style.color = '#00A551'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 rounded-xl transition-all duration-200 hover:bg-red-50"
              >
                <LogOut className="w-4.5 h-4.5" />
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
