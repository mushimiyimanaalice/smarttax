import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  BarChart3,
  Shield,
  FileSearch,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getAdminNavItems, getRoleLabel, getAdminScopeLabel } from '../../utils/roles';

const icons = {
  dashboard: LayoutDashboard,
  approvals: CheckSquare,
  businesses: Building2,
  reports: BarChart3,
  compliance: Shield,
  audit: FileSearch,
};

const AdminSidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navItems = getAdminNavItems(user?.role);

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 text-white border-r border-slate-800">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center font-bold">
            ST
          </div>
          <div>
            <p className="font-semibold text-lg leading-tight">SmartTax</p>
            <p className="text-xs text-slate-400">Administration</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-slate-800/80">
          <p className="text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-xs text-green-400 mt-0.5">{getRoleLabel(user?.role)}</p>
          <p className="text-xs text-slate-400 mt-1 truncate">{getAdminScopeLabel(user)}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = icons[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <p className="px-6 py-4 text-xs text-slate-500 border-t border-slate-800">
        Desktop admin console
      </p>
    </aside>
  );
};

export default AdminSidebar;
