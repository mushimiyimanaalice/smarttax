import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getHomePath } from '../utils/roles';

const RoleHomeRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={getHomePath(user?.role)} replace />;
};

export default RoleHomeRedirect;
