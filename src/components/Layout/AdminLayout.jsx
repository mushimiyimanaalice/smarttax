import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import AdminSidebar from './AdminSidebar';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import NotificationBell from '../Notifications/NotificationBell';
import { Sun, Moon } from 'lucide-react';

const AdminLayout = () => {
  const { user, token } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <AdminSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-30 border-b shadow-sm"
          style={{ background: 'var(--header-bg)', borderColor: 'var(--header-border)', backdropFilter: 'blur(16px)' }}
        >
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold" style={{ color: '#003DA5' }}>SmartTax Admin</h1>
                <p className="text-xs" style={{ color: '#00A551' }}>{getRoleLabel(user?.role)}</p>
              </div>
              <div className="lg:hidden">
                <p className="text-sm font-semibold" style={{ color: '#003DA5' }}>SmartTax</p>
                <p className="text-[10px]" style={{ color: '#00A551' }}>{getAdminScopeLabel(user)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-white/20 active:scale-90"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <LanguageSwitcher />
              <NotificationBell userId={user?.id || user?._id} token={token} />
              <div className="hidden sm:block text-right text-xs ml-1">
                <p className="font-medium" style={{ color: '#003DA5' }}>{user?.fullName}</p>
                <p className="truncate max-w-[140px]" style={{ color: '#00A551' }}>{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
