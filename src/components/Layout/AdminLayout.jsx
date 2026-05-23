import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getRoleLabel } from '../../utils/roles';
import AdminSidebar from './AdminSidebar';
import LanguageSwitcher from '../Common/LanguageSwitcher';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">SmartTax Admin</h1>
              <p className="text-sm text-slate-500">{getRoleLabel(user?.role)}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-800">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="lg:hidden bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-900 text-center">
          Admin console is designed for desktop. Use a PC for the best experience.
        </div>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
