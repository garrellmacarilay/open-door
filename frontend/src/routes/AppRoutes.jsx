import React from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import StudentContainer from '../modules/Student/pages/Dashboard/StudentContainer.jsx';
import StaffContainer from '../modules/Staffs/pages/Dashboard/StaffContainer.jsx';
import AdminContainer from '../modules/Admin_PSAS/pages/Dashboard/AdminContainer.jsx';
import Landingpage from "../public-pages/Landing/Landingpage.jsx";
import Login from "../public-pages/Auth/Login.jsx";


function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landingpage />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/dashboard" element={<StudentContainer />} />
            <Route path="/staff-dashboard" element={<StaffContainer />} />
            <Route path="/admin-dashboard" element={<AdminContainer />} />
        </Routes>
    </BrowserRouter>

  )
}

export default AppRoutes