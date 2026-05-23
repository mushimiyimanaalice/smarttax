const ADMIN_ROLES = ['national_admin', 'provincial_admin', 'district_admin', 'sector_admin'];

const isAdminRole = (role) => ADMIN_ROLES.includes(role);

/** Build MongoDB filter for Business.address fields from admin user scope */
const buildBusinessGeoFilter = (user, base = {}) => {
  const query = { ...base };
  if (!user || !isAdminRole(user.role)) return query;

  if (user.role === 'sector_admin' && user.sector) {
    query['address.sector'] = user.sector;
    if (user.district) query['address.district'] = user.district;
    if (user.province) query['address.province'] = user.province;
  } else if (user.role === 'district_admin' && user.district) {
    query['address.district'] = user.district;
    if (user.province) query['address.province'] = user.province;
  } else if (user.role === 'provincial_admin' && user.province) {
    query['address.province'] = user.province;
  }

  return query;
};

const getGeoScope = (user) => ({
  provinceId: user?.province || null,
  districtId: user?.district || null,
  sectorId: user?.sector || null,
  role: user?.role,
});

const ACTIVE_BUSINESS_STATUSES = ['active', 'approved'];

const isBusinessActive = (status) => ACTIVE_BUSINESS_STATUSES.includes(status);

module.exports = {
  ADMIN_ROLES,
  isAdminRole,
  buildBusinessGeoFilter,
  getGeoScope,
  ACTIVE_BUSINESS_STATUSES,
  isBusinessActive,
};
