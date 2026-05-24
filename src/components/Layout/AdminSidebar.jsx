import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getAdminNavItems, getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import {
  LayoutDashboard, BarChart3, TrendingUp, FileBarChart, Shield, Map,
  Building2, ClipboardCheck, MapPin, Clock, Activity, Users,
  UserCog, Wallet, Smartphone, Brain, FileSearch, ShieldAlert,
  Bell, Settings, DollarSign, AlertTriangle, Download, User,
  FileText, Calendar, Package, Warehouse, ShoppingCart, Landmark,
  Bot, Mic, BellRing, HelpCircle, ArrowLeftRight, X, Menu,
  ChevronDown,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, BarChart3, TrendingUp, FileBarChart, Shield, Map,
  Building2, ClipboardCheck, MapPin, Clock, Activity, Users,
  UserCog, Wallet, Smartphone, Brain, FileSearch, ShieldAlert,
  Bell, Settings, DollarSign, AlertTriangle, Download, User,
  FileText, Calendar, Package, Warehouse, ShoppingCart, Landmark,
  Bot, Mic, BellRing, HelpCircle, ArrowLeftRight,
};

const AdminSidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getAdminNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">ST</div>
            <div>
              <p className="font-semibold text-base leading-tight text-white">SmartTax</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 p-2.5 rounded-lg bg-slate-800/80">
          <p className="text-sm font-medium truncate text-white">{user?.fullName}</p>
          <p className="text-[11px] text-green-400 mt-0.5">{getRoleLabel(user?.role)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{getAdminScopeLabel(user)}</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/admin/profile"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <User className="w-4.5 h-4.5" />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all"
        >
          <ShieldAlert className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 text-white border-r border-slate-800 z-40">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 shadow-2xl overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
