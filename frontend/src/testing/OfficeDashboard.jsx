import { useEffect, useState, useCallback } from "react";
import api from "../utils/api";

import OfficeHeader from '../office_components/OfficeHeader'
import OfficeCalendar from '../office_components/OfficeCalendar'
import EventList from "../components/EventList";
import AppointmentList from "../components/AppointmentList";
import AppointmentRequests from "../components/AppointmentRequests";
import OfficeActions from "../office_components/OfficeActions";
import OfficeConsultationSummary from "../office_components/OfficeConsultationSummary";
import AdminEvents from "../admin_components/AdminEvents";

export default function OfficeDashboard() {
    const [appointments, setAppointments] = useState([])
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedBookingId, setSelectedBookingId] = useState(null)
    const [events, setEvents] = useState([])
    const [activePage, setActivePage] = useState("dashboard");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null)

    const fetchUser = async () => {
        try {
            const res  = await api.get('/user')
            if (res.data.success) setUser(res.data.user)
        } catch (err) {
            console.error ('fetch user failed:', err)
        }
    }

    const fetchOfficeAppointments = async () => {
        try {
            const res = await api.get('/office/dashboard')
            if (res.data.success) {
                setAppointments(res.data.data)
            }
        } catch (err) {
            console.error('fetch appointment failed:' ,err)
        }
    }

    const fetchEvents = async () => {
        try {
            const res = await api.get('/calendar/events')
            if (res.data.success) setEvents(res.data.data);
        } catch (err) {
            console.error('Fetch events error:', err)
        }
    }

    const fetchBookingById = async (id) => {
        try {
            const res = await api.get(`/office/bookings/${id}`)
            if (res.data.success) setSelectedBooking(res.data.data)
        } catch (err) {
            console.error('Fetch booking error:', err)
        }
    }

    const handleSelectBooking = async (id) => {
        setSelectedBookingId(id)
        await fetchBookingById(id)
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await api.patch(`/office/bookings/status/${id}`, { status })

            if (res.data.success) {
                setAppointments((prev) => 
                    prev.map((appt) =>
                        appt.id === id ? { ...appt, status } : appt
                    )
                )

                setSelectedBookingId(null)
                setSelectedBooking(null)
            } 
        } catch (err) {
            console.error('Update status error', err)
        }
    }

    const handleLogout = async () => {
        try {
            const res = await api.post('/logout')
            if (res.data.success) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (err) {
            alert('Failed to log out')
        }
    }

    useEffect(() =>{
        (async () => {
            await Promise.all([
                fetchOfficeAppointments(),
                fetchEvents(),
                fetchUser()
            ])
            setLoading(false)
        })()
    }, [])

    if (loading) return <div className="p-6">Loading dashboard...</div>;

    return (
        <div className="flex h-screen">
            <OfficeActions user={user} onSelect={setActivePage} onLogout={handleLogout} />
        <main className="flex-1 flex flex-col p-6 overflow-auto">
            <OfficeHeader />
            {activePage === 'dashboard' && (
                <div className="flex flex-col md:flex-row gap-6 h-[80vh] overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <OfficeCalendar appointments={appointments} />
                </div>

                <aside className="w-full md:w-[350px] flex-shrink-0 overflow-auto space-y-4">

                    <AppointmentList
                        appointments={appointments}
                        onSelect={handleSelectBooking} 
                    />

                    <EventList
                        isStaff={user?.role === 'staff'}
                        events={events}
                        onCreateEvent={() => {
                            setSelectedEvent(null);
                            setIsModalOpen(true);
                        }}
                        onEditEvent={(event) => {
                            setSelectedEvent(event);
                            setIsModalOpen(true);
                        }}
                    />
                </aside>
            </div>

            )}
            
            {activePage === 'consultation_summary' && <OfficeConsultationSummary />}
        </main>
        {selectedBookingId && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[90%]">

                    <AppointmentRequests
                        booking={selectedBooking}
                        loading={!selectedBooking}
                        onApprove={(id) => handleStatusUpdate(id, "approved")}
                        onDecline={(id) => handleStatusUpdate(id, "declined")}
                    />

                    <button
                        onClick={() => {
                            setSelectedBookingId(null)
                            setSelectedBooking(null)
                        }}
                        className="w-full py-2 bg-red-500 text-white rounded-b-xl hover:bg-red-600"
                    >
                        Close
                    </button>  
                </div>
            </div>
        )}
        {isModalOpen && (
            <AdminEvents
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEventCreated={fetchEvents}
                eventData={selectedEvent}
            />
        )}
    </div>
    )
}