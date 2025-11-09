import React from 'react'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import StudentContainer from '../modules/Student/pages/Dashboard/StudentContainer.jsx';
import Landingpage from "../public-pages/Landing/Landingpage.jsx";
import Login from "../public-pages/Auth/Login.jsx";


function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Landingpage />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/dashboard" element={<StudentContainer />} />
        </Routes>
    </BrowserRouter>

  )
}

export default AppRoutes