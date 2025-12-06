import React from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import StudentContainer from '../modules/Student/pages/Dashboard/StudentContainer.jsx';
import StaffContainer from '../modules/Staffs/pages/Dashboard/StaffContainer.jsx';
import AdminContainer from '../modules/Admin_PSAS/pages/Dashboard/AdminContainer.jsx';
import Landingpage from "../public-pages/Landing/Landingpage.jsx";
import Login from "../public-pages/Auth/Login.jsx";
import AuthCallback from '../public-pages/Auth/AuthCallback.jsx';
import UnauthorizedPage from '../public-pages/Auth/UnauthorizedPage.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import Preloader from '../loading/Preloader.jsx';

const isAuthenticated = () => !!localStorage.getItem("token");

function AppRoutes() {
  const { user, loading } = useAuth() 
  
  return (
    <>
      <Preloader loading={loading}/>

      {!loading &&(
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Landingpage />}/>
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route path="/dashboard/student" element={<ProtectedRoutes roles={['student']}><StudentContainer /></ProtectedRoutes>} />
              <Route path="/dashboard/admin" element={<ProtectedRoutes roles={['admin']}><AdminContainer /></ProtectedRoutes>} />
              <Route path="/dashboard/office" element={<ProtectedRoutes roles={['staff']}><StaffContainer /></ProtectedRoutes>} />

              <Route path="/dashboard" element={
                  !user ? <Navigate to="/login" replace /> :
                  user.role === 'student' ? <Navigate to="/dashboard/student" replace /> :
                  user.role === 'staff' ? <Navigate to="/dashboard/office" replace /> :
                  user.role === 'admin' ? <Navigate to="/dashboard/admin" replace /> :
                  <Navigate to="/unauthorized" replace />
              } />
          </Routes>
      </BrowserRouter>
      )}
    </>


  )
}

export default AppRoutes