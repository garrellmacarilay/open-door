import { useState } from 'react';
import SideNavigation from './SideNavigation';
import Calendar from './Calendar';
import OfficesList from './OfficesList';
import ReviewsSection from './ReviewsSection';
import './AdminCalendar.css';

function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="admin-calendar">
      <SideNavigation />
      <div className="main-content">
        <h1 className="dashboard-title">Administrator Dashboard</h1>
        <div className="content-grid">
          <OfficesList />
          <div className="calendar-section">
            <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            <ReviewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCalendar;
