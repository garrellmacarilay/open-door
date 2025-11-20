import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

// Components
import AdminHeader from "../admin_components/AdminHeader.jsx";
import AdminStats from "../admin_components/AdminStats.jsx";
import AdminCalendar from "../admin_components/AdminCalendar.jsx";
import AppointmentList from "../components/AppointmentList.jsx";
import AdminActions from "../admin_components/AdminActions.jsx";
import EventList from "../components/EventList.jsx";
import AdminEvents from "../admin_components/AdminEvents.jsx";
import AppointmentRequests from "../components/AppointmentRequests.jsx";
import AdminConsultationSummary from "../admin_components/AdminConsultationSummary.jsx";
import AdminAnalytics from "../admin_components/AdminAnalytics.jsx";
import AdminOfficeManagement from "../admin_components/AdminOfficeManagement.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ===== STATE =====
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== FUNCTIONS =====

  const fetchUser = async () => {
    const res = await api.get("/user");
    setUser(res.data.user);
  };

  const fetchDashboardStats = async () => {
    const res = await api.get("/admin/dashboard");
    if (res.data.success) setStats(res.data.stats);
  };

  const fetchAppointments = async () => {
    const res = await api.get("/calendar/appointments");
    if (res.data.success) setAppointments(res.data.data);
  };

  const fetchEvents = async () => {
    const res = await api.get("/calendar/events");
    if (res.data.success) setEvents(res.data.data);
  };

  const fetchBookingById = async (id) => {
    setBookingLoading(true);
    try {
      const res = await api.get(`/admin/bookings/${id}`); // <--- backend must support this GET route
      if (res.data.success) {
        setSelectedBooking(res.data.data); // expects the booking resource payload
      } else {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      setSelectedBooking(null);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAppointmentSelect = async (id) => {
    setSelectedBookingId(id);
    await fetchBookingById(id);
  }

  const handleBookingStatus = async (id, status) => {
    try {
      const res = await api.patch(`/bookings/status/${id}`, {
        status,
      })

      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? {...appt, status} : appt 
          ) 
        )

        setSelectedBookingId(null)
        setSelectedBooking(null)

        alert("Booking updated successfully")
      } else {
        console.error("Failed to update booking status", res.data.message)
      }
    } catch (err){
      console.error("Error updating booking status", err)
    }
  }

  const loadDashboard = useCallback(async () => {
    try {
      await Promise.all([
        fetchUser(),
        fetchDashboardStats(),
        fetchEvents(),
        fetchAppointments()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      if (res.data.success) {
        localStorage.removeItem("token");
        alert('Loggoed out successfully!')
        navigate("/login");
      }
    } catch {
      alert("Failed to log out.");
    }
  };

  // ===== EFFECT =====
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ===== RENDER =====
  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <AdminActions user={user} onLogout={handleLogout} onSelect={setActivePage} />

      {/* Main */}
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        <AdminHeader user={user} onSelectBooking={handleAppointmentSelect}/>

        {activePage === "dashboard" && (
          <>
            <AdminStats stats={stats} />

            <div className="flex flex-col md:flex-row gap-6 h-[80vh] overflow-hidden">
              <div className="flex-1 overflow-auto">
                <AdminCalendar appointments={appointments} />
              </div>

              <aside className="w-full md:w-[350px] flex-shrink-0 overflow-auto">
                <AppointmentList appointments={appointments} onSelect={handleAppointmentSelect} />
                <EventList
                  events={events}
                  isAdmin={user?.role === "admin"}
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
          </>
        )}

        {activePage === "consultation_summary" && <AdminConsultationSummary />}

        {activePage === "analytics" && <AdminAnalytics />}

        {activePage === "office_management" && <AdminOfficeManagement />}
      </main>
      
      {selectedBookingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[400px] max-w-[90%]">
            {bookingLoading ? (
              <div className="p-6">Loading booking...</div>
            ) : selectedBooking ? (
              <>
                <AppointmentRequests booking={selectedBooking} loading={false} onApprove={(id) => handleBookingStatus(id, 'approved')} onDecline={(id) => handleBookingStatus(id, 'declined')}/>
                <button
                  onClick={() => {
                    setSelectedBookingId(null);
                    setSelectedBooking(null);
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-b-xl hover:bg-red-600"
                >
                  Close
                </button>
              </>
            ) : (
              <div className="p-6">Booking not found.</div>
            )}
          </div>
        </div>
      )}
      {/* Event Modal */}
      {isModalOpen && (
        <AdminEvents
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchEvents}
          eventData={selectedEvent}
        />
      )}

    </div>
  );
}
