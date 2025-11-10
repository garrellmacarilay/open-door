// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is logged in (you'll have your own logic here)
  const isAuthenticated = localStorage.getItem('token'); // or use Context/Redux
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, show the protected content
  return children;
}

export default ProtectedRoute;