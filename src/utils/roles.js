export const ADMIN_ROLES = [
  'national_admin',
  'provincial_admin',
  'district_admin',
  'sector_admin',
];

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

/** Sidebar items visible per admin role */
export const getAdminNavItems = (role) => {
  const base = [
    { path: '/admin/dashboard', label: 'Overview', icon: 'dashboard' },
    { path: '/admin/approvals', label: 'Pending approvals', icon: 'approvals' },
    { path: '/admin/businesses', label: 'Businesses', icon: 'businesses' },
  ];

  if (role === 'national_admin' || role === 'provincial_admin' || role === 'district_admin') {
    base.push({ path: '/admin/reports', label: 'Tax reports', icon: 'reports' });
  }

  if (role === 'sector_admin' || role === 'district_admin') {
    base.push({ path: '/admin/inactivity', label: 'Inactivity', icon: 'audit' });
  }

  if (role === 'national_admin') {
    base.push({ path: '/admin/compliance', label: 'Compliance', icon: 'compliance' });
    base.push({ path: '/admin/audit-logs', label: 'Audit logs', icon: 'audit' });
    base.push({ path: '/admin/inactivity', label: 'Inactivity', icon: 'audit' });
  }

  return base;
};
