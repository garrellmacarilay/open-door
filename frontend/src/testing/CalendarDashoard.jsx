import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BookAConsultation from './BookAConsultation.jsx';

export default function CalendarDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // 👈 for the logged-in user's name
  const navigate = useNavigate();

  // 🔹 Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/calendar/events', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setEvents(res.data.data);
        } else {
          console.error('Failed to fetch events:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        window.location.href = '/login';
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log out.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading calendar...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-2 text-center">
        📅 Welcome {user?.student?.student_name || user?.full_name || 'Student'}!
      </h2>
      <p className="text-center text-gray-600 mb-5">Here’s your consultation calendar.</p>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.color,
        }))}
        height="auto"
      />

      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate('/bookings')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Book a Consultation
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate('/bookings/history')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Booking History
        </button>
      </div>
    </div>
  );
}
