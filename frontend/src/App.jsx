import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

// 🧩 Pages
import Login from "./testing/Login.jsx";
import AuthCallback from "./testing/AuthCallback.jsx";
import CalendarDashboard from "./testing/CalendarDashoard.jsx";
import BookAConsultation from "./testing/BookAConsultation.jsx";
import BookingHistory from "./testing/BookingHistory.jsx";
import RecentBooking from "./testing/RecentBooking.jsx";
import AdminDashboard from "./testing/AdminDashboard.jsx";

// 🧠 Route Guards
import AdminRoute from "./utils/auth/AdminRoute.jsx";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  const token = isAuthenticated();

  return (
    <Router>
      <Routes>
        {/* 🏠 Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔑 Auth Routes */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* 🎓 Student Dashboard */}
        <Route
          path="/dashboard"
          element={token ? <CalendarDashboard /> : <Navigate to="/login" replace />}
        />

        {/* 📘 Booking Routes */}
        <Route
          path="/bookings"
          element={token ? <BookAConsultation /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/bookings/history"
          element={token ? <BookingHistory /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/bookings/recent"
          element={token ? <RecentBooking /> : <Navigate to="/login" replace />}
        />

        {/* 🧑‍💼 Admin Dashboard (Protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 🧭 Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
