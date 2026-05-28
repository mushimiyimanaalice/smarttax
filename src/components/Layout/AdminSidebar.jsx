import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { getAdminNavItems, getRoleLabel, getAdminScopeLabel } from '../../utils/roles';
import {
  LayoutDashboard, BarChart3, TrendingUp, FileBarChart, Shield, Map,
  Building2, ClipboardCheck, MapPin, Clock, Activity, Users,
  UserCog, Wallet, Smartphone, Brain, FileSearch, ShieldAlert,
  Bell, Settings, DollarSign, AlertTriangle, Download, User,
  FileText, Calendar, Package, Warehouse, ShoppingCart, Landmark,
  Bot, Mic, BellRing, HelpCircle, ArrowLeftRight, X, Menu,
  ChevronDown, Sun, Moon,
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
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getAdminNavItems(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarBg = theme === 'light' ? 'var(--bg-sidebar)' : 'var(--header-bg)';
  const sidebarBlur = theme === 'light' ? 'none' : 'blur(20px)';
  const sideText = theme === 'light' ? 'text-white' : '';

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: sidebarBg, backdropFilter: sidebarBlur, WebkitBackdropFilter: sidebarBlur }}>
      <div className="px-4 py-5" style={{ borderBottom: theme === 'light' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg" style={{ background: 'linear-gradient(135deg, #00A551, #FAD201)' }}>
              ST
            </div>
            <div>
              <p className="font-semibold text-base leading-tight" style={{ color: theme === 'light' ? 'white' : '#003DA5' }}>SmartTax</p>
              <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: theme === 'light' ? '#FAD201' : '#00A551' }}>Admin</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1" style={{ color: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 p-2.5 rounded-lg border" style={{ background: theme === 'light' ? 'rgba(255,255,255,0.12)' : 'var(--bg-card)', borderColor: theme === 'light' ? 'rgba(255,255,255,0.15)' : 'var(--border-color)' }}>
          <p className="text-sm font-medium truncate" style={{ color: theme === 'light' ? 'white' : '#003DA5' }}>{user?.fullName}</p>
          <p className="text-[11px] mt-0.5 font-medium" style={{ color: theme === 'light' ? '#FAD201' : '#00A551' }}>{getRoleLabel(user?.role)}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)' }}>{getAdminScopeLabel(user)}</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: 'none' }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  theme === 'light' && !isActive ? 'hover:bg-white/10' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive
                  ? theme === 'light' ? 'white' : '#00A551'
                  : theme === 'light' ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)',
                background: isActive
                  ? theme === 'light' ? 'linear-gradient(135deg, #00A551, #008040)' : 'rgba(0,165,81,0.08)'
                  : 'transparent',
                boxShadow: isActive && theme === 'light' ? '0 4px 12px rgba(0,165,81,0.3)' : 'none',
              })}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-3 space-y-1" style={{ borderTop: theme === 'light' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-color)' }}>
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10" style={{ color: theme === 'light' ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)' }}>
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <NavLink
          to="/admin/profile"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'light' && !isActive ? 'hover:bg-white/10' : ''}`
          }
          style={({ isActive }) => ({
            color: isActive
              ? theme === 'light' ? 'white' : '#00A551'
              : theme === 'light' ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)',
            background: isActive
              ? theme === 'light' ? 'linear-gradient(135deg, #00A551, #008040)' : 'rgba(0,165,81,0.08)'
              : 'transparent',
            boxShadow: isActive && theme === 'light' ? '0 4px 12px rgba(0,165,81,0.3)' : 'none',
          })}
        >
          <User className="w-4.5 h-4.5" />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10" style={{ color: theme === 'light' ? '#FCA5A5' : '#EF4444' }}
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
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 text-white rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40" style={{ background: sidebarBg, backdropFilter: sidebarBlur, WebkitBackdropFilter: sidebarBlur, borderRight: theme === 'light' ? 'none' : '1px solid var(--border-color)' }}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl overflow-y-auto" style={{ background: sidebarBg, backdropFilter: sidebarBlur, WebkitBackdropFilter: sidebarBlur }}>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
