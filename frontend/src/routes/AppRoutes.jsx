import React from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import StudentContainer from '../modules/Student/pages/Dashboard/StudentContainer.jsx';
import Landingpage from "../public-pages/Landing/Landingpage.jsx";
import Login from "../public-pages/Auth/Login.jsx";
import AuthCallback from '../public-pages/Auth/AuthCallback.jsx';

const isAuthenticated = () => !!localStorage.getItem("token");

function AppRoutes() {
  const token = isAuthenticated()

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landingpage />}/>
            <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/dashboard" element={token ? <StudentContainer /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>

  )
}

export default AppRoutes