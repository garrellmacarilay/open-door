import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from '../components/SideBar.jsx';
import MainContent from '../components/MainContent.jsx';
import BookingHistory from "../testing/BookingHistory.jsx";
import AppointmentList from '../components/AppointmentList.jsx';
import EventList from '../components/EventList.jsx';
import RecentBooking from './RecentBooking.jsx';


export default function CalendarDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([])
  const [activePage, setActivePage] = useState('calendar')

  const navigate = useNavigate()

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

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/my-bookings');
        if (res.data.success) setAppointments(res.data.data);
        else console.error('Failed to fetch events:', res.data.message);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  //Fetch events
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await api.get('/calendar/events');
      if (res.data.success) setEvents(res.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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
        navigate('/login')
        
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
        onShowRecent={() => setActivePage("recent")}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onLogout={handleLogout}
      />

       <div className='flex flex-1 flex-col md:flex-row p-4 gap-4 overflow-hidden'>
        {activePage === "calendar" && (
          <>
            <div className="flex-1 overflow-y-auto">
              <MainContent
                appointments={appointments}
                isBookingOpen={isBookingOpen}
                onCloseBooking={() => setIsBookingOpen(false)}
                isEditProfileOpen={isEditProfileOpen}
                onCloseEditProfile={() =>setIsEditProfileOpen(false)}
              />
            </div>

            <div className='w-full md:w-[350px] flex-shrink-0 overflow-auto flex flex-col gap-4'> 
              <EventList events={events}  isAdmin={user?.role === 'admin'}/>
              <AppointmentList appointments={appointments} />
            </div>
          </>
        )}

        {activePage === "history" && (
          <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 shadow">
            <BookingHistory />
          </div>
        )}

        {activePage === "recent" && (
          <div className="flex-1 h-full overflow-y-auto bg-white rounded-lg p-4 shadow">
            <RecentBooking />
          </div>
        )}
      </div>
    </div>
  );
}
