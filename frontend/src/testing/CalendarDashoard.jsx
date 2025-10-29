import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Sidebar from '../components/SideBar.jsx';
import MainContent from '../components/MainContent.jsx';

export default function CalendarDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/calendar/events');
        if (res.data.success) setEvents(res.data.data);
        else console.error('Failed to fetch events:', res.data.message);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post('/logout');
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

  if (loading) return <div className="text-center mt-5">Loading calendar...</div>;

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <Sidebar
        user={user}
        onBookClick={() => setIsBookingOpen(true)}
        onLogout={handleLogout}
      />
      <MainContent
        events={events}
        isBookingOpen={isBookingOpen}
        onCloseBooking={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
