export const ADMIN_ROLES = [
  'national_admin',
  'provincial_admin',
  'district_admin',
  'sector_admin',
];

export const ALL_ROLES = [...ADMIN_ROLES, 'business_owner'];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const getHomePath = (role) =>
  isAdminRole(role) ? '/admin/dashboard' : '/dashboard';

export const getRoleLabel = (role) => {
  const labels = {
    national_admin: 'National Administrator',
    provincial_admin: 'Provincial Administrator',
    district_admin: 'District Administrator',
    sector_admin: 'Sector Administrator',
    business_owner: 'Business Owner',
  };
  return labels[role] || role;
};

export const getRoleBadgeColor = (role) => {
  const colors = {
    national_admin: 'bg-purple-100 text-purple-800',
    provincial_admin: 'bg-blue-100 text-blue-800',
    district_admin: 'bg-green-100 text-green-800',
    sector_admin: 'bg-amber-100 text-amber-800',
    business_owner: 'bg-slate-100 text-slate-800',
  };
  return colors[role] || 'bg-slate-100 text-slate-800';
};

export const getAdminScopeLabel = (user) => {
  if (!user) return '';
  if (user.role === 'national_admin') return 'Rwanda (National)';
  if (user.role === 'provincial_admin') return user.province || 'Province';
  if (user.role === 'district_admin') return `${user.district || 'District'}, ${user.province || ''}`.trim();
  if (user.role === 'sector_admin') {
    return [user.sector, user.district, user.province].filter(Boolean).join(', ');
  }
  return '';
};

export const NAV_ITEMS = {
  national_admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/national-analytics', label: 'National Analytics', icon: 'BarChart3' },
    { path: '/admin/revenue-monitoring', label: 'Revenue Monitoring', icon: 'TrendingUp' },
    { path: '/admin/tax-reports', label: 'Tax Reports', icon: 'FileBarChart' },
    { path: '/admin/compliance', label: 'Compliance Reports', icon: 'Shield' },
    { path: '/admin/province-performance', label: 'Province Performance', icon: 'Map' },
    { path: '/admin/businesses', label: 'Business Management', icon: 'Building2' },
    { path: '/admin/approvals', label: 'Pending Approvals', icon: 'ClipboardCheck' },
    { path: '/admin/business-locations', label: 'Business Locations', icon: 'MapPin' },
    { path: '/admin/inactivity', label: 'Inactive Businesses', icon: 'Clock' },
    { path: '/admin/activity-monitoring', label: 'Activity Monitoring', icon: 'Activity' },
    { path: '/admin/user-management', label: 'User Management', icon: 'Users' },
    { path: '/admin/provincial-admins', label: 'Provincial Admins', icon: 'UserCog' },
    { path: '/admin/district-admins', label: 'District Admins', icon: 'UserCog' },
    { path: '/admin/sector-admins', label: 'Sector Admins', icon: 'UserCog' },
    { path: '/admin/payment-monitoring', label: 'Payment Monitoring', icon: 'Wallet' },
    { path: '/admin/momo-transactions', label: 'MoMo Transactions', icon: 'Smartphone' },
    { path: '/admin/ai-insights', label: 'AI Insights', icon: 'Brain' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: 'FileSearch' },
    { path: '/admin/security', label: 'Security Center', icon: 'ShieldAlert' },
    { path: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/admin/settings', label: 'System Settings', icon: 'Settings' },
    { path: '/admin/tax-settings', label: 'Tax Settings', icon: 'DollarSign' },
    { path: '/admin/penalty-settings', label: 'Penalty Settings', icon: 'AlertTriangle' },
    { path: '/admin/export', label: 'Export Reports', icon: 'Download' },
    { path: '/admin/profile', label: 'Profile Settings', icon: 'User' },
  ],
  provincial_admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/provincial-analytics', label: 'Provincial Analytics', icon: 'BarChart3' },
    { path: '/admin/revenue-monitoring', label: 'Revenue Reports', icon: 'TrendingUp' },
    { path: '/admin/compliance', label: 'Compliance Reports', icon: 'Shield' },
    { path: '/admin/businesses', label: 'Business Management', icon: 'Building2' },
    { path: '/admin/approvals', label: 'Pending Approvals', icon: 'ClipboardCheck' },
    { path: '/admin/district-monitoring', label: 'District Monitoring', icon: 'Map' },
    { path: '/admin/district-admins', label: 'District Admins', icon: 'UserCog' },
    { path: '/admin/inactivity', label: 'Inactive Businesses', icon: 'Clock' },
    { path: '/admin/activity-monitoring', label: 'Activity Monitoring', icon: 'Activity' },
    { path: '/admin/payment-monitoring', label: 'Payment Monitoring', icon: 'Wallet' },
    { path: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/admin/export', label: 'Export Reports', icon: 'Download' },
    { path: '/admin/profile', label: 'Profile Settings', icon: 'User' },
  ],
  district_admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/district-analytics', label: 'District Analytics', icon: 'BarChart3' },
    { path: '/admin/tax-reports', label: 'Tax Reports', icon: 'FileBarChart' },
    { path: '/admin/businesses', label: 'Business Monitoring', icon: 'Building2' },
    { path: '/admin/approvals', label: 'Pending Approvals', icon: 'ClipboardCheck' },
    { path: '/admin/sector-monitoring', label: 'Sector Monitoring', icon: 'Map' },
    { path: '/admin/inactivity', label: 'Inactive Businesses', icon: 'Clock' },
    { path: '/admin/activity-monitoring', label: 'Activity Reports', icon: 'Activity' },
    { path: '/admin/sector-admins', label: 'Sector Admins', icon: 'UserCog' },
    { path: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/admin/export', label: 'Export Reports', icon: 'Download' },
    { path: '/admin/profile', label: 'Profile Settings', icon: 'User' },
  ],
  sector_admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/admin/approvals', label: 'Business Approvals', icon: 'ClipboardCheck' },
    { path: '/admin/businesses', label: 'Businesses', icon: 'Building2' },
    { path: '/admin/inactivity', label: 'Inactivity Monitoring', icon: 'Clock' },
    { path: '/admin/inactivity-explanations', label: 'Submitted Explanations', icon: 'FileText' },
    { path: '/admin/tax-reports', label: 'Tax Monitoring', icon: 'FileBarChart' },
    { path: '/admin/payment-plans', label: 'Payment Plans', icon: 'Calendar' },
    { path: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/admin/export', label: 'Reports', icon: 'Download' },
    { path: '/admin/profile', label: 'Profile Settings', icon: 'User' },
  ],
  business_owner: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/switch-business', label: 'Switch Business', icon: 'ArrowLeftRight' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/inventory', label: 'Inventory', icon: 'Warehouse' },
    { path: '/sales', label: 'Sales / POS', icon: 'ShoppingCart' },
    { path: '/invoices', label: 'Invoices', icon: 'FileText' },
    { path: '/taxes', label: 'Tax Management', icon: 'Landmark' },
    { path: '/pending-taxes', label: 'Pending Taxes', icon: 'Clock' },
    { path: '/payment-history', label: 'Payment History', icon: 'Wallet' },
    { path: '/reports', label: 'Reports & Analytics', icon: 'BarChart3' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: 'Bot' },
    { path: '/voice-assistant', label: 'Voice Assistant', icon: 'Mic' },
    { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    { path: '/business-settings', label: 'Business Settings', icon: 'Settings' },
    { path: '/notification-preferences', label: 'Notification Preferences', icon: 'BellRing' },
    { path: '/profile', label: 'Profile Settings', icon: 'User' },
    { path: '/help', label: 'Help & Support', icon: 'HelpCircle' },
  ],
};

export const getAdminNavItems = (role) => NAV_ITEMS[role] || NAV_ITEMS.national_admin;

export const ROLE_PERMISSIONS = {
  national_admin: {
    canViewAll: true,
    canManageAdmins: true,
    canManageAllBusinesses: true,
    canSuspendBusinesses: true,
    canViewAuditLogs: true,
    canManageSystem: true,
    canManageTaxSettings: true,
    canViewAiInsights: true,
    canExportReports: true,
    scope: 'national',
  },
  provincial_admin: {
    canViewAll: false,
    canManageAdmins: false,
    canManageAllBusinesses: false,
    canSuspendBusinesses: true,
    canViewAuditLogs: false,
    canManageSystem: false,
    canManageTaxSettings: false,
    canViewAiInsights: false,
    canExportReports: true,
    scope: 'province',
  },
  district_admin: {
    canViewAll: false,
    canManageAdmins: false,
    canManageAllBusinesses: false,
    canSuspendBusinesses: false,
    canViewAuditLogs: false,
    canManageSystem: false,
    canManageTaxSettings: false,
    canViewAiInsights: false,
    canExportReports: true,
    scope: 'district',
  },
  sector_admin: {
    canViewAll: false,
    canManageAdmins: false,
    canManageAllBusinesses: false,
    canSuspendBusinesses: false,
    canViewAuditLogs: false,
    canManageSystem: false,
    canManageTaxSettings: false,
    canViewAiInsights: false,
    canExportReports: true,
    scope: 'sector',
  },
  business_owner: {
    canViewAll: false,
    canManageAdmins: false,
    canManageAllBusinesses: false,
    canSuspendBusinesses: false,
    canViewAuditLogs: false,
    canManageSystem: false,
    canManageTaxSettings: false,
    canViewAiInsights: false,
    canExportReports: false,
    scope: 'business',
  },
};
