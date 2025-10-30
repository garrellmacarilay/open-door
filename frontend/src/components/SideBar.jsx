import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../testing/NotificationModal';

export default function Sidebar({ user, onBookClick, onShowCalendar, onShowHistory, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="w-72 bg-white border-r border-gray-300 p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-xl font-semibold mb-6">
        👋 {user?.student?.student_name || user?.full_name || 'Student'}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onShowCalendar}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
        >
          📅 Calendar Dashboard
        </button>
        <button
          onClick={onBookClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Book a Consultation
        </button>
        <button
          onClick={onShowHistory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
         📜 Booking History
        </button>
        <button
          onClick={() => navigate('/bookings/recent')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Booked Consultation
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
