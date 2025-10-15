import React, {useEffect} from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarDashboard() {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/calendar/events', {
                    // headers: {
                    //     Authorization: `Bearer ${localStorage.getItem('token')}`
                    // }
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
        </div>
    )
}


