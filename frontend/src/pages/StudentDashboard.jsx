import React from "react";
import Sidebar from '../student_components/SideBar'
import Header from "../student_components/Header";
import CalendarSection from "../student_components/CalendarSection";
import EventList from "../student_components/EventList";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex flex-1 overflow-hidden">
          <CalendarSection />
          <EventList />
        </main>
      </div>
    </div>
  );
}
