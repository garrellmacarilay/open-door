import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import NotificationModal from "./NotificationModal.jsx";
import api from "../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch admin user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching admin user:", error);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Fetch dashboard stats + recent bookings
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboard();
  }, []);

  // 🔹 Fetch all bookings as calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/calendar/events");
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      if (res.data.success) {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to log out.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          🧑‍💼 Welcome {user?.full_name || "Admin"}!
        </h2>
        <NotificationModal />
      </div>

      {/* Stats Section */} 
      {stats && (
       <div className="flex flex-wrap justify-center lg:justify-between gap-6 mb-10">
  
          <div className="w-full sm:w-[300px] bg-purple-500 text-white rounded-xl p-6 shadow text-center">
            <h2 className="text-lg font-semibold">Today's Consultations</h2>
            <p className="text-3xl font-bold mt-2">{stats.today}</p>
          </div>

          
          <div className="w-full sm:w-[300px] bg-purple-500 text-white rounded-xl p-6 shadow text-center">
            <h2 className="text-lg font-semibold">Pending</h2>
            <p className="text-3xl font-bold mt-2">{stats.pending}</p>
          </div>

          <div className="w-full sm:w-[300px] bg-purple-500 text-white rounded-xl p-6 shadow text-center">
            <h2 className="text-lg font-semibold">This Month</h2>
            <p className="text-3xl font-bold mt-2">{stats.month}</p>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <p className="text-center text-gray-600 mb-5">
        Here's an overview of all consultation bookings.
      </p>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: event.color,
        }))}
        height="auto"
      />

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {/* <button
          onClick={() => navigate("/admin/manage-bookings")}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
        >
          Manage Bookings
        </button> */}
        {/* <button
          onClick={() => navigate("/admin/students")}
          className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
        >
          View Students
        </button>
        <button
          onClick={() => navigate("/admin/staff")}
          className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition"
        >
          Manage Staff
        </button> */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
