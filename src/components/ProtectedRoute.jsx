import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isAdminRole, ADMIN_ROLES } from '../utils/roles';

const ProtectedRoute = ({ children, roles, adminOnly, businessOnly }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userIsAdmin = isAdminRole(user?.role);

  if (businessOnly && userIsAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    if (userIsAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export { ADMIN_ROLES };
export default ProtectedRoute;
