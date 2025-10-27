import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CalendarDashboard from './testing/CalendarDashoard.jsx'
import Login from './testing/Login.jsx'
import AuthCallback from './testing/AuthCallback.jsx'
import BookAConsultation from './testing/BookAConsultation.jsx'
import BookingHistory from './testing/BookingHistory.jsx'
import RecentBooking from './testing/RecentBooking.jsx'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
// import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <CalendarDashboard /> : <Navigate to="/login" />} />
        <Route path='/bookings' element={token ?<BookAConsultation />: <Navigate to="/login"/>}/>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/bookings/history" element={token ? <BookingHistory /> : <Navigate to="/login" />} />
        <Route path="/bookings/recent" element={token ? <RecentBooking /> : <Navigate to="/login"/>}  />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
