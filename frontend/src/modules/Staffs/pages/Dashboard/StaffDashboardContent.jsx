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
    const [eventsList, setEventsList] = useState([])
    const { loading, error, appointments, fetchDashboard } = useDashboardAppointments();
    const {events, fetchEvents} = useEvents()

    useEffect(() => {
      fetchDashboard();
      fetchEvents()
    }, []);

    const handleAddEvent = (newEvent) => {
      setEventsList((prev) => [...prev, newEvent]);
    };

    const handleDeleteEvent = (eventId) => {
      setEventsList((prev) => prev.filter((event) => event.id !== eventId));
    };

    // Staff-specific appointments (consultations they need to handle)
  
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
      // 1. Root container needs h-full and overflow-hidden to contain the scrollable area
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* 2. Main Scrollable Container 
             - overflow-y-auto: Enables scrolling for the whole dashboard
             - flex-1: Fills available space
        */}
        <div className="flex-1 px-4 pb-6 flex gap-3 overflow-y-auto">
          
          {/* Left Column (Calendar) */}
          {/* Added min-h-[600px] to prevent squashing and force scroll on small screens */}
          <div className="flex-1 min-w-0 flex flex-col min-h-[600px]">
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
              isAnimating={isAnimating}
            />
          </div>
          
          {/* Right Column (Sidebar) */}
          {/* Added min-h-[600px] to match the calendar height */}
          <div className="w-80 flex flex-col gap-3 shrink-0 min-h-[600px]">
            
            {/* Upcoming Consultations */}
            <div className="flex-1 min-h-0 pt-[58px]"> {/* Added padding-top to align with calendar below header if needed, or remove if header is part of calendar */}
              <StaffUpcomingAppointments upcomingEvents={appointments} />
            </div>
            
            {/* Upcoming Events */}
            <div className="flex-1 min-h-0">
              <StaffUpcomingEvents 
                upcomingEvents={events}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          </div>

        </div>
      </div>
    );
}

export default StaffDashboardContent;