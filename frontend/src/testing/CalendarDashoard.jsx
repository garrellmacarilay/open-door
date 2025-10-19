import React, {useEffect} from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BookAConsultaion from './BookAConsultation.jsx';

export default function CalendarDashboard() {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }); 

            const data = res.data;

            if (data.success) {
                localStorage.removeItem('token');
                alert('Logged out successfully!');
                window.location.href = '/login';
            }
        } catch (err) { 
            console.error(err)
            alert('Failed to log out.');
        }
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/calendar/events', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
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
        } 

        fetchEvents();
    }, [])

      if (loading) {
        return <div className="text-center mt-5">Loading calendar...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-5 text-center">📅 Booking Calendar</h2>

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
                    onClick={() => window.location.href = '/bookings'}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Book a Consultation

                </button>
            </div>
        </div>
        
    )
}


