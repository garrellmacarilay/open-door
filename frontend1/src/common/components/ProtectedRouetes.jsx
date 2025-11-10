// src/common/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useAuth();

  // If user not logged in
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn’t have permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, show the protected content
  return children;
}
