import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AdminHeader from "../admin_components/AdminHeader.jsx";
import AdminStats from "../admin_components/AdminStats.jsx";
import AdminCalendar from "../admin_components/AdminCalendar.jsx";
import EventList from "../components/EventList.jsx";
import AdminActions from "../admin_components/AdminActions.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        console.log("Dashboard API response:", res.data);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await api.get("/calendar/events");
        if (res.data.success) setEvents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchStats();
    fetchEvents();
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
          <AdminCalendar events={events} />
        </div>
        <div className="w-full md:w-[350px] flex-shrink-0 overflow-auto">
          <EventList events={events} />
        </div>
      </div>
    </div>
  </div>
  );
}
