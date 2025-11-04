import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminHeader from "../admin_components/AdminHeader.jsx";
import AdminStats from "../admin_components/AdminStats.jsx";
import AdminCalendar from "../admin_components/AdminCalendar.jsx";
import AppointmentList from "../components/AppointmentList.jsx";
import AdminActions from "../admin_components/AdminActions.jsx";
import EventList from "../components/EventList.jsx";
import AdminEvents from "../admin_components/AdminEvents.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all dashboard data in one function
  const loadDashboard = async () => {
    try {
      const resUser = await api.get("/user");
      setUser(resUser.data.user);

      const resStats = await api.get("/admin/dashboard");
      if (resStats.data.success) setStats(resStats.data.stats);

      await fetchEvents(); // ✅ Load events

      const resAppointments = await api.get("/calendar/appointments");
      if (resAppointments.data.success)
        setAppointments(resAppointments.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ Only once
    }
  };

  // ✅ Separate fetchEvents so we can call it after event creation
  const fetchEvents = async () => {
    try {
      const res = await api.get("/calendar/events");
      if (res.data.success) setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      if (res.data.success) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to log out.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminActions user={user} onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        <AdminHeader user={user} />
        <AdminStats stats={stats} />

        <div className="flex flex-col md:flex-row gap-6 h-[80vh] overflow-hidden">
          <div className="flex-1 overflow-auto">
            <AdminCalendar appointments={appointments} />
          </div>

          <div className="w-full md:w-[350px] flex-shrink-0 overflow-auto">
            <AppointmentList appointments={appointments} />

            <EventList
              events={events}
              isAdmin={user?.role === "admin"}
              onCreateEvent={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* ✅ Pass refetch to modal */}
      {isModalOpen && (
        <AdminEvents
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchEvents} // ✅ refresh list after creating event
        />
      )}
    </div>
  );
}
