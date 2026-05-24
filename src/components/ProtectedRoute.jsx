import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ADMIN_ROLES } from '../utils/roles';

const ProtectedRoute = ({ children, businessOnly, adminOnly, roles, permissions }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (businessOnly && ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (adminOnly) {
    if (!ADMIN_ROLES.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  if (permissions && Array.isArray(permissions)) {
    const hasAllPermissions = permissions.every((perm) => {
      if (typeof perm === 'function') return perm(user);
      return true;
    });
    if (!hasAllPermissions) {
      return <Navigate to={ADMIN_ROLES.includes(user.role) ? '/admin/dashboard' : '/dashboard'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
