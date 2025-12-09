import React, { useState, useEffect } from 'react';
import StaffCalendarHeader from './StaffCalendarHeader';
import StaffUpcomingAppointments from './StaffUpcomingAppointments';
import StaffUpcomingEvents from './StaffUpcomingEvents';
import StaffCalendar from './StaffCalendar';
import { useDashboardAppointments } from '../../../../hooks/staffHooks';
import { useEvents } from '../../../../hooks/globalHooks';

function StaffDashboardContent() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAnimating, setIsAnimating] = useState(false);
    const [eventsList, setEventsList] = useState([]);
    

    // 1. Use hooks to get data
    const { loading, error, appointments, fetchDashboard } = useDashboardAppointments();
    const { events, fetchEvents } = useEvents();

    // 2. Initial Fetch + Real-Time Polling
    useEffect(() => {
      // A. Fetch immediately on load
      fetchDashboard();
      fetchEvents();

    // Sync fetched data to local state
    // When the API returns data ('events'), update your local 'eventsList'
    useEffect(() => {
      if (events) {
        setEventsList(events);
      }
    }, [events]);

      // C. Cleanup timer when component unmounts
      return () => clearInterval(intervalId);
    }, []); 

    const handleDateNavigation = (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);
      const newDate = new Date(currentDate);
      newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
      setCurrentDate(newDate);
      setTimeout(() => setIsAnimating(false), 300);
    };

    const goToToday = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentDate(new Date());
      setTimeout(() => setIsAnimating(false), 300);
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 px-4 pb-4 flex gap-2 overflow-hidden min-h-0">
          
          {/* Left Column (Calendar) */}
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <StaffCalendarHeader 
                currentDate={currentDate}
                navigateMonth={handleDateNavigation}
                setShowReminderModal={() => {}} 
                goToToday={goToToday}
                isAnimating={isAnimating}
            />
            <StaffCalendar 
              currentDate={currentDate}
              bookedAppointments={appointments}
              events={events} // ✅ Passing events directly from the hook
              isAnimating={isAnimating}
            />
          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="w-80 flex flex-col gap-2 shrink-0 min-h-0">
            
            {/* Upcoming Consultations */}
            <div className="flex-1 min-h-0 mt-2"> 
              <StaffUpcomingAppointments 
                upcomingEvents={appointments} 
                onUpdate={fetchDashboard} // ✅ Triggers refresh when status changes
              />
            </div>
            
            {/* Upcoming Events */}
            <div className="flex-1 min-h-0">
              <StaffUpcomingEvents 
                upcomingEvents={events} 
                onAddEvent={fetchEvents}    // ✅ Triggers refresh when event added
                onDeleteEvent={fetchEvents} // ✅ Triggers refresh when event deleted
              />
            </div>
          </div>

        </div>
      </div>
    );
}

export default StaffDashboardContent;