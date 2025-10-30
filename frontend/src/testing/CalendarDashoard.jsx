import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Sidebar from '../components/SideBar.jsx';
import MainContent from '../components/MainContent.jsx';
import BookingHistory from "../testing/BookingHistory.jsx";
import EventList from '../components/EventList.jsx';

export default function CalendarDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [activePage, setActivePage] = useState('calendar')

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
        onShowCalendar={() => setActivePage("calendar")}
        onShowHistory={() => setActivePage("history")}
        onLogout={handleLogout}
      />

       <div className='flex flex-1 flex-col md:flex-row p-4 gap-4 overflow-hidden'>
        {activePage === "calendar" && (
          <>
            <div className="flex-1 overflow-y-auto">
              <MainContent
                events={events}
                isBookingOpen={isBookingOpen}
                onCloseBooking={() => setIsBookingOpen(false)}
              />
            </div>

            <div className='w-full md:w-[350px] flex-shrink-0 overflow-auto'> 
              <EventList events={events} />
            </div>
          </>
        )}

        {activePage === "history" && (
          <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 shadow">
            <BookingHistory />
          </div>
        )}
      </div>
    </div>
  );
}
