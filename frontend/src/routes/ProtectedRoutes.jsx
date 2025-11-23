import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // or spinner while fetching user

  if (!user) return <Navigate to="/login" />; // not logged in

  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />; // role not allowed

  return children; // user logged in and role allowed
};

export default ProtectedRoute;
