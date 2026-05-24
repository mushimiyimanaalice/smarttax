import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import AdminSidebar from './AdminSidebar';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import NotificationBell from '../Notifications/NotificationBell';

const AdminLayout = () => {
  const { user, token } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-slate-800">SmartTax Admin</h1>
                <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
              </div>
              <div className="lg:hidden">
                <p className="text-sm font-semibold text-slate-800">SmartTax</p>
                <p className="text-[10px] text-slate-500">{getAdminScopeLabel(user)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSwitcher />
              <NotificationBell userId={user?.id || user?._id} token={token} />
              <div className="hidden sm:block text-right text-xs">
                <p className="font-medium text-slate-800">{user?.fullName}</p>
                <p className="text-slate-500 truncate max-w-[160px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
